from django.db import models


class PromoCode(models.Model):
    TYPE_CHOICES = (("percent", "Percent"), ("fixed", "Fixed"))

    code = models.CharField(max_length=40, primary_key=True)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    discount = models.PositiveIntegerField()
    min_order = models.PositiveIntegerField(default=0)
    label = models.CharField(max_length=120, blank=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.code
