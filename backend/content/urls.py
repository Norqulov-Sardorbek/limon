from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"testimonials", views.TestimonialViewSet)
router.register(r"faq", views.FAQViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("stats/", views.stats),
]
