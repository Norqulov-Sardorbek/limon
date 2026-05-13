from rest_framework import serializers
from catalog.models import Product
from catalog.serializers import ProductSerializer
from .models import Cart, CartItem, Order, OrderItem, OrderTimeline


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ("id", "product", "qty")


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = ("items", "count")


class OrderItemSerializer(serializers.ModelSerializer):
    farmerId = serializers.CharField(source="farmer_slug")

    class Meta:
        model = OrderItem
        fields = ("id", "name", "unit", "price", "qty", "farmerId", "img", "product")


class OrderTimelineSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderTimeline
        fields = ("code", "label", "ts")


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    timeline = OrderTimelineSerializer(many=True, read_only=True)
    customer = serializers.SerializerMethodField()
    paymentMethod = serializers.CharField(source="payment_method")
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = Order
        fields = (
            "id", "status", "subtotal", "delivery", "discount", "total",
            "promo", "items", "timeline", "customer", "paymentMethod",
            "comment", "createdAt",
        )

    def get_customer(self, obj):
        return {
            "name": obj.customer_name,
            "phone": obj.customer_phone,
            "address": obj.customer_address,
            "region": obj.customer_region,
        }
