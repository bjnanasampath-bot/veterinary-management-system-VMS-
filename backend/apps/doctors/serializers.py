from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta
from .models import Doctor

class DoctorSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    analytics = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True, min_length=8, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)
    user_id = serializers.ReadOnlyField(source='user.id')

    class Meta:
        model = Doctor
        fields = '__all__'

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')
        if password or confirm_password:
            if not password or not confirm_password:
                raise serializers.ValidationError({
                    'password': 'Both password and confirm_password are required when setting a doctor login password.'
                })
            if password != confirm_password:
                raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password', None)
        validated_data.pop('confirm_password', None)
        return super().create(validated_data)

    def get_analytics(self, obj):
        now = timezone.now()
        today = now.date()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)
        year_ago = today - timedelta(days=365)

        apps = obj.appointments.all()
        
        return {
            'daily': apps.filter(appointment_date=today).count(),
            'weekly': apps.filter(appointment_date__gte=week_ago).count(),
            'monthly': apps.filter(appointment_date__gte=month_ago).count(),
            'yearly': apps.filter(appointment_date__gte=year_ago).count(),
            'status_breakdown': {
                'completed': apps.filter(status='completed').count(),
                'scheduled': apps.filter(status='scheduled').count(),
                'cancelled': apps.filter(status='cancelled').count(),
                'in_progress': apps.filter(status='in_progress').count(),
            }
        }


class DoctorListSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = Doctor
        fields = ['id', 'full_name', 'email', 'phone', 'specialization', 'experience_years', 'consultation_fee', 'photo', 'is_active']

