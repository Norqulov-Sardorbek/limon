from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model

from .serializers import UserSerializer, RegisterSerializer

User = get_user_model()


def _tokens_for(user):
    refresh = RefreshToken.for_user(user)
    return {"access": str(refresh.access_token), "refresh": str(refresh)}


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def register(request):
    ser = RegisterSerializer(data=request.data)
    if not ser.is_valid():
        first = next(iter(ser.errors.values()))
        msg = first[0] if isinstance(first, list) else str(first)
        return Response({"ok": False, "error": msg}, status=400)
    if User.objects.filter(email__iexact=ser.validated_data["email"]).exists():
        return Response(
            {"ok": False, "error": "Bu email allaqachon ro'yxatdan o'tgan."},
            status=400,
        )
    user = ser.save()
    return Response(
        {"ok": True, "user": UserSerializer(user).data, **_tokens_for(user)}
    )


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def login(request):
    email = request.data.get("email", "")
    password = request.data.get("password", "")
    user = authenticate(request, username=email, password=password)
    if not user:
        return Response({"ok": False, "error": "Email yoki parol xato."}, status=400)
    return Response(
        {"ok": True, "user": UserSerializer(user).data, **_tokens_for(user)}
    )


@api_view(["GET", "PATCH"])
@permission_classes([permissions.IsAuthenticated])
def me(request):
    if request.method == "PATCH":
        ser = UserSerializer(request.user, data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response({"ok": True, "user": ser.data})
    return Response(UserSerializer(request.user).data)
