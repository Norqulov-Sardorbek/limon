from rest_framework import serializers
from .models import Category, Farmer, Product


class CategorySerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="slug")

    class Meta:
        model = Category
        fields = ("id", "name", "icon", "color")


class FarmerSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="slug")

    class Meta:
        model = Farmer
        fields = (
            "id", "name", "farm", "region", "years", "rating",
            "deliveries", "verified", "phone", "avatar",
        )


class ProductSerializer(serializers.ModelSerializer):
    cat = serializers.CharField(source="category_id")
    farmerId = serializers.CharField(source="farmer_id", allow_null=True)
    oldPrice = serializers.IntegerField(source="old_price")
    minOrder = serializers.IntegerField(source="min_order")
    desc = serializers.CharField(source="description", allow_blank=True)

    class Meta:
        model = Product
        fields = (
            "id", "cat", "farmerId", "name", "unit", "price", "oldPrice",
            "minOrder", "stock", "harvest", "organic", "badge", "img",
            "desc", "custom",
        )


class ProductCreateSerializer(serializers.ModelSerializer):
    cat = serializers.PrimaryKeyRelatedField(
        source="category", queryset=Category.objects.all()
    )
    oldPrice = serializers.IntegerField(source="old_price", required=False, default=0)
    minOrder = serializers.IntegerField(source="min_order", required=False, default=10)
    desc = serializers.CharField(source="description", required=False, allow_blank=True)

    class Meta:
        model = Product
        fields = (
            "cat", "name", "unit", "price", "oldPrice", "minOrder",
            "stock", "harvest", "organic", "badge", "img", "desc",
        )
