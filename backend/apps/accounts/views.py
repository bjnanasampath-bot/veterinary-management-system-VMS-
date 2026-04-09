from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from decouple import config
from common.responses import success_response, error_response
from .models import User, PasswordResetOTP
from .serializers import (
    CustomTokenObtainPairSerializer, RegisterSerializer,
    UserSerializer, ChangePasswordSerializer,
    ForgotPasswordSerializer, VerifyOTPSerializer
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


class GoogleAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')
        if not token:
            return error_response(message="Token is required")

        try:
            # Specify the CLIENT_ID of the app that accesses the backend:
            CLIENT_ID = config('GOOGLE_CLIENT_ID', default='')
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), CLIENT_ID)
            # For now, we verify without CLIENT_ID for development or get it from settings
            # idinfo = id_token.verify_oauth2_token(token, google_requests.Request())

            email = idinfo.get('email')
            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')

            try:
                user = User.objects.get(email=email)
                # Existing user -> Login
                refresh = RefreshToken.for_user(user)
                return success_response(
                    data={
                        'access': str(refresh.access_token),
                        'refresh': str(refresh),
                        'user': UserSerializer(user).data,
                        'is_new': False
                    },
                    message="Login successful"
                )
            except User.DoesNotExist:
                # New user -> Return info for pre-filling
                return success_response(
                    data={
                        'email': email,
                        'first_name': first_name,
                        'last_name': last_name,
                        'is_new': True
                    },
                    message="Google account verified. Please complete registration."
                )

        except ValueError:
            return error_response(message="Invalid Google token")


class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.filter(is_active=True)


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(message="Validation failed", errors=serializer.errors)

        email = serializer.validated_data['email']

        # Invalidate any existing unused OTPs for this email
        PasswordResetOTP.objects.filter(email=email, is_used=False).update(is_used=True)

        # Generate and save new OTP
        otp = PasswordResetOTP.generate_otp()
        PasswordResetOTP.objects.create(email=email, otp=otp)

        # In development: print OTP to console
        # In production: send via email/SMS
        print(f"\n{'='*40}")
        print(f"  PASSWORD RESET OTP for {email}")
        print(f"  OTP: {otp}")
        print(f"  Valid for 10 minutes")
        print(f"{'='*40}\n")

        return success_response(
            message="A 6-digit security code has been sent. Please check your registered email/phone."
        )


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(message="Validation failed", errors=serializer.errors)

        email = serializer.validated_data['email']
        otp_code = serializer.validated_data['otp']
        new_password = serializer.validated_data['new_password']

        # Find the latest unused OTP for this email
        try:
            otp_obj = PasswordResetOTP.objects.filter(
                email=email, otp=otp_code, is_used=False
            ).latest('created_at')
        except PasswordResetOTP.DoesNotExist:
            return error_response(message="Invalid security code. Please try again.")

        if otp_obj.is_expired():
            otp_obj.is_used = True
            otp_obj.save()
            return error_response(message="Security code has expired. Please request a new one.")

        # Valid OTP — reset password
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return error_response(message="User not found.")

        user.set_password(new_password)
        user.save()

        # Mark OTP as used
        otp_obj.is_used = True
        otp_obj.save()

        return success_response(message="Password reset successfully. You can now log in.")
