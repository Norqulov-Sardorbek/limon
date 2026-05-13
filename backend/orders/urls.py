from django.urls import path
from . import views

urlpatterns = [
    path("cart/", views.cart_detail),
    path("cart/totals/", views.cart_totals),
    path("cart/clear/", views.cart_clear),
    path("cart/items/", views.cart_add),
    path("cart/items/<int:product_id>/", views.cart_item),
    path("orders/", views.order_list),
    path("orders/place/", views.place_order),
    path("orders/<str:order_id>/", views.order_detail),
    path("orders/<str:order_id>/advance/", views.order_advance),
]
