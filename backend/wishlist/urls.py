from django.urls import path
from . import views

urlpatterns = [
    path("wishlist/", views.wishlist_list),
    path("wishlist/toggle/", views.wishlist_toggle),
]
