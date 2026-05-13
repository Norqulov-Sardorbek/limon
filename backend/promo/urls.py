from django.urls import path
from . import views

urlpatterns = [
    path("promo/validate/", views.validate_promo),
]
