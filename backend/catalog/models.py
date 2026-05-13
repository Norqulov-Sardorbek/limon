from django.db import models
from django.conf import settings


class Category(models.Model):
    slug = models.CharField(max_length=40, primary_key=True)
    name = models.CharField(max_length=80)
    icon = models.CharField(max_length=8, blank=True)
    color = models.CharField(max_length=16, blank=True)

    def __str__(self):
        return self.name


class Farmer(models.Model):
    slug = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=120)
    farm = models.CharField(max_length=160)
    region = models.CharField(max_length=64)
    years = models.PositiveIntegerField(default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    deliveries = models.PositiveIntegerField(default=0)
    verified = models.BooleanField(default=False)
    phone = models.CharField(max_length=32, blank=True)
    avatar = models.CharField(max_length=8, blank=True)
    owner = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="farmer_profile",
    )

    def __str__(self):
        return self.name


class Product(models.Model):
    UNIT_CHOICES = (("kg", "kg"), ("litr", "litr"), ("dona", "dona"))

    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products")
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE, related_name="products", null=True, blank=True)
    name = models.CharField(max_length=160)
    unit = models.CharField(max_length=8, choices=UNIT_CHOICES, default="kg")
    price = models.PositiveIntegerField()
    old_price = models.PositiveIntegerField(default=0)
    min_order = models.PositiveIntegerField(default=10)
    stock = models.PositiveIntegerField(default=100)
    harvest = models.DateField(null=True, blank=True)
    organic = models.BooleanField(default=False)
    badge = models.CharField(max_length=40, blank=True)
    img = models.URLField(max_length=500, blank=True)
    description = models.TextField(blank=True)
    custom = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name
