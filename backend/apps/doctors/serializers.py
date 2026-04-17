from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta
from .models import Doctor, Attendance

class AttendanceSerializer(serializers.ModelSerializer):
    doctor_name = serializers.ReadOnlyField(source='doctor.full_name')

    class Meta:
        model = Attendance
        fields = ['id', 'doctor', 'doctor_name', 'date', 'status', 'check_in_time', 'notes', 'created_at']
        read_only_fields = ['created_at']

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
        password = validated_data.pop('password', None)
        validated_data.pop('confirm_password', None)
        
        from apps.accounts.models import User
        
        email = validated_data.get('email')
        user = User.objects.filter(email=email).first()
        if not user:
            if not password:
                password = "Password@123" # Default secure password if none provided
            user = User.objects.create_user(
                email=email,
                first_name=validated_data.get('first_name'),
                last_name=validated_data.get('last_name'),
                phone=validated_data.get('phone', ''),
                role='doctor',
                password=password
            )
            
        validated_data['user'] = user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        validated_data.pop('confirm_password', None)
        
        # If password is provided, update the User model
        if password and instance.user:
            instance.user.set_password(password)
            instance.user.save()
            
        return super().update(instance, validated_data)

    def get_analytics(self, obj):
        now = timezone.now()
        today = now.date()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)
        year_ago = today - timedelta(days=365)

        apps = obj.appointments.all()
        treatments = obj.treatments.all().select_related('pet', 'pet__owner')

        # Extract unique medicines
        all_meds = []
        for t in treatments:
            if isinstance(t.medications, list):
                all_meds.extend([m.get('name') for m in t.medications if isinstance(m, dict) and m.get('name')])
        
        return {
            'daily': apps.filter(appointment_date=today).count(),
            'weekly': apps.filter(appointment_date__gte=week_ago).count(),
            'monthly': apps.filter(appointment_date__gte=month_ago).count(),
            'yearly': apps.filter(appointment_date__gte=year_ago).count(),
            'clients_seen': treatments.values_list('pet__owner', flat=True).distinct().count(),
            'medicines_used': sorted(list(set(all_meds))),
            'prescription_history': list(treatments.values('id', 'pet__name', 'prescription', 'treatment_date')[:10]),
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
