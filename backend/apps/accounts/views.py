from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from common.responses import success_response, error_response
from .models import User
from .serializers import (
    CustomTokenObtainPairSerializer, RegisterSerializer,
    UserSerializer, ChangePasswordSerializer
)


class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return success_response(
                data=UserSerializer(user).data,
                message="User registered successfully",
                status_code=status.HTTP_201_CREATED
            )
        return error_response(message="Registration failed", errors=serializer.errors)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return success_response(message="Logged out successfully")
        except Exception:
            return error_response(message="Invalid token")


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return success_response(data=UserSerializer(request.user).data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return success_response(data=serializer.data, message="Profile updated")
        return error_response(errors=serializer.errors)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()
            return success_response(message="Password changed successfully")
        return error_response(errors=serializer.errors)


class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.filter(is_active=True)
