import random
from django.db import models
from django.conf import settings
from catalog.models import Product


def _order_id():
    return f"ORD-{random.randint(100000, 999999)}"


class Cart(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="cart")
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def count(self):
        return sum(i.qty for i in self.items.all())


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    qty = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = [("cart", "product")]


class Order(models.Model):
    STATUS_CHOICES = (
        ("new", "Yangi buyurtma"),
        ("accepted", "Dehqon qabul qildi"),
        ("preparing", "Tayyorlanmoqda"),
        ("shipping", "Yo'lda"),
        ("delivered", "Yetkazib berildi"),
        ("cancelled", "Bekor qilindi"),
    )

    id = models.CharField(primary_key=True, max_length=16, default=_order_id, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders")
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default="new")

    subtotal = models.PositiveIntegerField(default=0)
    delivery = models.PositiveIntegerField(default=0)
    discount = models.PositiveIntegerField(default=0)
    total = models.PositiveIntegerField(default=0)
    promo = models.CharField(max_length=40, blank=True)

    customer_name = models.CharField(max_length=120)
    customer_phone = models.CharField(max_length=40)
    customer_address = models.CharField(max_length=255)
    customer_region = models.CharField(max_length=64, blank=True)

    payment_method = models.CharField(max_length=40, blank=True)
    comment = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=160)
    unit = models.CharField(max_length=8)
    price = models.PositiveIntegerField()
    qty = models.PositiveIntegerField()
    farmer_slug = models.CharField(max_length=20, blank=True)
    img = models.URLField(max_length=500, blank=True)


class OrderTimeline(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="timeline")
    code = models.CharField(max_length=16)
    label = models.CharField(max_length=80)
    ts = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["ts"]
