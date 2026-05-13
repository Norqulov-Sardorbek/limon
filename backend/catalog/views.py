from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q

from .models import Category, Farmer, Product
from .serializers import (
    CategorySerializer, FarmerSerializer,
    ProductSerializer, ProductCreateSerializer,
)


REGIONS = [
    "Toshkent", "Toshkent viloyati", "Andijon", "Farg'ona", "Namangan",
    "Samarqand", "Buxoro", "Xorazm", "Navoiy", "Qashqadaryo",
    "Surxondaryo", "Jizzax", "Sirdaryo", "Qoraqalpog'iston",
]


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class FarmerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Farmer.objects.all()
    serializer_class = FarmerSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related("category", "farmer").all()

    def get_serializer_class(self):
        if self.action == "create":
            return ProductCreateSerializer
        return ProductSerializer

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        qs = super().get_queryset()
        p = self.request.query_params

        q = p.get("query")
        if q:
            qs = qs.filter(Q(name__icontains=q) | Q(description__icontains=q))

        cat = p.get("category")
        if cat:
            qs = qs.filter(category_id=cat)

        region = p.get("region")
        if region:
            qs = qs.filter(farmer__region=region)

        organic = p.get("organic")
        if organic in ("true", "1"):
            qs = qs.filter(organic=True)
        elif organic in ("false", "0"):
            qs = qs.filter(organic=False)

        min_price = p.get("minPrice")
        max_price = p.get("maxPrice")
        if min_price:
            qs = qs.filter(price__gte=int(min_price))
        if max_price:
            qs = qs.filter(price__lte=int(max_price))

        sort = p.get("sort")
        if sort == "price-asc":
            qs = qs.order_by("price")
        elif sort == "price-desc":
            qs = qs.order_by("-price")
        elif sort == "new":
            qs = qs.order_by("-harvest")
        else:
            qs = qs.order_by("-stock")
        return qs

    def create(self, request, *args, **kwargs):
        user = request.user
        if user.role != "farmer":
            return Response(
                {"ok": False, "error": "Faqat dehqonlar mahsulot qo'sha oladi."},
                status=403,
            )
        ser = self.get_serializer(data=request.data)
        ser.is_valid(raise_exception=True)
        farmer = getattr(user, "farmer_profile", None)
        product = ser.save(farmer=farmer, custom=True)
        return Response(
            {"ok": True, "product": ProductSerializer(product).data},
            status=201,
        )


@api_view(["GET"])
def regions(request):
    return Response(REGIONS)
