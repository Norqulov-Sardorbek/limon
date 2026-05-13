from django.db import models


class Testimonial(models.Model):
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=200, blank=True)
    region = models.CharField(max_length=64, blank=True)
    text = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.name


class FAQ(models.Model):
    question = models.CharField(max_length=255)
    answer = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"

    def __str__(self):
        return self.question


class Stats(models.Model):
    """Singleton: landing page counters."""
    farmers = models.PositiveIntegerField(default=0)
    shops = models.PositiveIntegerField(default=0)
    products = models.PositiveIntegerField(default=0)
    regions = models.PositiveIntegerField(default=0)
    deliveries = models.PositiveIntegerField(default=0)
    saved_sum = models.BigIntegerField(default=0)

    class Meta:
        verbose_name_plural = "Stats"

    def __str__(self):
        return "Limon stats"
