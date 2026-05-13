from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Testimonial, FAQ, Stats
from .serializers import TestimonialSerializer, FAQSerializer, StatsSerializer


class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer


class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer


@api_view(["GET"])
def stats(request):
    s = Stats.objects.first()
    if not s:
        return Response({})
    return Response(StatsSerializer(s).data)
