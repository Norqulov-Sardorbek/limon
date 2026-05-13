from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import PromoCode


@api_view(["POST"])
def validate_promo(request):
    code = request.data.get("code", "")
    subtotal = int(request.data.get("subtotal") or 0)
    try:
        p = PromoCode.objects.get(code=code, active=True)
    except PromoCode.DoesNotExist:
        return Response({"ok": False, "error": "Bunday promo-kod yo'q."}, status=400)
    if subtotal < p.min_order:
        return Response(
            {"ok": False, "error": f"Minimal buyurtma: {p.min_order} so'm"},
            status=400,
        )
    return Response({
        "ok": True,
        "promo": {
            "code": p.code, "type": p.type, "discount": p.discount,
            "minOrder": p.min_order, "label": p.label,
        },
    })
