from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("accounts.urls")),
    path("api/", include("catalog.urls")),
    path("api/", include("orders.urls")),
    path("api/", include("wishlist.urls")),
    path("api/", include("promo.urls")),
    path("api/", include("content.urls")),
    path("api/auth/refresh/", TokenRefreshView.as_view()),
]
