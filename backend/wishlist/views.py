from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import WishlistItem


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def wishlist_list(request):
    ids = list(request.user.wishlist.values_list("product_id", flat=True))
    return Response(ids)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def wishlist_toggle(request):
    pid = request.data.get("productId")
    if not pid:
        return Response({"ok": False, "error": "productId kerak"}, status=400)
    existing = request.user.wishlist.filter(product_id=pid).first()
    if existing:
        existing.delete()
        return Response({"ok": True, "active": False})
    WishlistItem.objects.create(user=request.user, product_id=pid)
    return Response({"ok": True, "active": True})
