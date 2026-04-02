from rest_framework import serializers
from .models import Doctor


class DoctorSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = Doctor
        fields = '__all__'


class DoctorListSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = Doctor
        fields = ['id', 'full_name', 'email', 'phone', 'specialization', 'experience_years', 'consultation_fee', 'photo', 'is_active']
