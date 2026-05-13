from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction

from catalog.models import Product
from promo.models import PromoCode
from .models import Cart, CartItem, Order, OrderItem, OrderTimeline
from .serializers import CartSerializer, OrderSerializer

DELIVERY_THRESHOLD = 1_000_000
DELIVERY_FEE = 50_000

STATUS_FLOW = ["new", "accepted", "preparing", "shipping", "delivered"]
STATUS_LABELS = dict(Order.STATUS_CHOICES)


def _get_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


def _compute_totals(cart, promo_code=None):
    items = list(cart.items.select_related("product"))
    subtotal = sum(i.product.price * i.qty for i in items)
    delivery = 0 if subtotal >= DELIVERY_THRESHOLD else (DELIVERY_FEE if items else 0)
    discount = 0
    promo = None
    if promo_code:
        try:
            p = PromoCode.objects.get(code=promo_code, active=True)
            if subtotal >= p.min_order:
                discount = int(subtotal * p.discount / 100) if p.type == "percent" else p.discount
                promo = p
        except PromoCode.DoesNotExist:
            pass
    total = max(0, subtotal + delivery - discount)
    return items, subtotal, delivery, discount, total, promo


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def cart_detail(request):
    cart = _get_cart(request.user)
    return Response(CartSerializer(cart).data)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def cart_add(request):
    product_id = request.data.get("productId")
    qty = int(request.data.get("qty") or 0)
    product = get_object_or_404(Product, pk=product_id)
    qty = max(product.min_order, qty or product.min_order)
    if qty > product.stock:
        return Response(
            {"ok": False, "error": f"Maksimal: {product.stock} {product.unit}"},
            status=400,
        )
    cart = _get_cart(request.user)
    item, created = CartItem.objects.get_or_create(cart=cart, product=product, defaults={"qty": qty})
    if not created:
        item.qty = min(product.stock, item.qty + qty)
        item.save()
    return Response({"ok": True, "count": cart.count})


@api_view(["PATCH", "DELETE"])
@permission_classes([permissions.IsAuthenticated])
def cart_item(request, product_id):
    cart = _get_cart(request.user)
    try:
        item = cart.items.select_related("product").get(product_id=product_id)
    except CartItem.DoesNotExist:
        return Response({"ok": False, "error": "Topilmadi"}, status=404)
    if request.method == "DELETE":
        item.delete()
        return Response({"ok": True})
    qty = int(request.data.get("qty") or 0)
    p = item.product
    if qty < p.min_order:
        qty = p.min_order
    elif qty > p.stock:
        qty = p.stock
    item.qty = qty
    item.save()
    return Response({"ok": True})


@api_view(["DELETE"])
@permission_classes([permissions.IsAuthenticated])
def cart_clear(request):
    cart = _get_cart(request.user)
    cart.items.all().delete()
    return Response({"ok": True})


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def cart_totals(request):
    cart = _get_cart(request.user)
    promo_code = request.query_params.get("promoCode")
    items, subtotal, delivery, discount, total, promo = _compute_totals(cart, promo_code)
    return Response({
        "subtotal": subtotal,
        "delivery": delivery,
        "discount": discount,
        "total": total,
        "appliedPromo": (
            {"code": promo.code, "type": promo.type, "discount": promo.discount,
             "minOrder": promo.min_order, "label": promo.label}
            if promo else None
        ),
        "items": [
            {
                "id": i.product.id, "name": i.product.name, "unit": i.product.unit,
                "price": i.product.price, "qty": i.qty,
                "line": i.product.price * i.qty,
                "img": i.product.img, "farmerId": i.product.farmer_id,
                "minOrder": i.product.min_order, "stock": i.product.stock,
            }
            for i in items
        ],
    })


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def place_order(request):
    data = request.data
    user = request.user
    cart = _get_cart(user)
    promo_code = data.get("promoCode")
    items, subtotal, delivery, discount, total, promo = _compute_totals(cart, promo_code)
    if not items:
        return Response({"ok": False, "error": "Savatcha bo'sh."}, status=400)

    with transaction.atomic():
        order = Order.objects.create(
            user=user,
            subtotal=subtotal, delivery=delivery, discount=discount, total=total,
            promo=promo.code if promo else "",
            customer_name=data.get("name", ""),
            customer_phone=data.get("phone", ""),
            customer_address=data.get("address", ""),
            customer_region=data.get("region", ""),
            payment_method=data.get("paymentMethod", ""),
            comment=data.get("comment", ""),
        )
        for ci in items:
            p = ci.product
            OrderItem.objects.create(
                order=order, product=p, name=p.name, unit=p.unit,
                price=p.price, qty=ci.qty,
                farmer_slug=p.farmer_id or "", img=p.img,
            )
            p.stock = max(0, p.stock - ci.qty)
            p.save(update_fields=["stock"])
        OrderTimeline.objects.create(order=order, code="new", label=STATUS_LABELS["new"])
        cart.items.all().delete()

    return Response({"ok": True, "order": OrderSerializer(order).data})


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def order_list(request):
    user = request.user
    qs = Order.objects.prefetch_related("items", "timeline")
    if user.role == "farmer":
        farmer = getattr(user, "farmer_profile", None)
        slug = farmer.slug if farmer else None
        if slug:
            qs = qs.filter(items__farmer_slug=slug).distinct()
        else:
            qs = qs.none()
    else:
        qs = qs.filter(user=user)
    return Response(OrderSerializer(qs, many=True).data)


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def order_detail(request, order_id):
    order = get_object_or_404(Order, pk=order_id)
    return Response(OrderSerializer(order).data)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def order_advance(request, order_id):
    order = get_object_or_404(Order, pk=order_id)
    if order.status not in STATUS_FLOW:
        return Response({"ok": False}, status=400)
    idx = STATUS_FLOW.index(order.status)
    if idx >= len(STATUS_FLOW) - 1:
        return Response({"ok": False, "error": "Yakuniy holat."}, status=400)
    new_status = STATUS_FLOW[idx + 1]
    order.status = new_status
    order.save(update_fields=["status"])
    OrderTimeline.objects.create(order=order, code=new_status, label=STATUS_LABELS[new_status])
    return Response({"ok": True, "order": OrderSerializer(order).data})
