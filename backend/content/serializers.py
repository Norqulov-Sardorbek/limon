from rest_framework import serializers
from .models import Testimonial, FAQ, Stats


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ("id", "name", "role", "region", "text", "rating")


class FAQSerializer(serializers.ModelSerializer):
    q = serializers.CharField(source="question")
    a = serializers.CharField(source="answer")

    class Meta:
        model = FAQ
        fields = ("id", "q", "a")


class StatsSerializer(serializers.ModelSerializer):
    savedSum = serializers.IntegerField(source="saved_sum")

    class Meta:
        model = Stats
        fields = ("farmers", "shops", "products", "regions", "deliveries", "savedSum")
