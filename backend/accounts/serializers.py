from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    shopName = serializers.CharField(source="shop_name", required=False, allow_blank=True)
    farmName = serializers.CharField(source="farm_name", required=False, allow_blank=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = User
        fields = (
            "id", "role", "name", "email", "phone",
            "shopName", "farmName", "region", "address", "createdAt",
        )
        read_only_fields = ("id", "createdAt")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    shopName = serializers.CharField(source="shop_name", required=False, allow_blank=True)
    farmName = serializers.CharField(source="farm_name", required=False, allow_blank=True)

    class Meta:
        model = User
        fields = (
            "role", "name", "email", "phone", "password",
            "shopName", "farmName", "region", "address",
        )

    def create(self, data):
        password = data.pop("password")
        user = User(**data)
        user.set_password(password)
        user.save()
        return user
