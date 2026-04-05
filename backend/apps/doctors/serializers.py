from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta
from .models import Doctor

class DoctorSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    analytics = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = '__all__'

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

