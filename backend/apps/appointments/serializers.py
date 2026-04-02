from rest_framework import serializers
from .models import Appointment
from apps.pets.serializers import PetListSerializer
from apps.doctors.serializers import DoctorListSerializer


class AppointmentSerializer(serializers.ModelSerializer):
    pet_name = serializers.CharField(source='pet.name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.full_name', read_only=True)
    owner_name = serializers.CharField(source='pet.owner.full_name', read_only=True)

    class Meta:
        model = Appointment
        fields = '__all__'


class AppointmentDetailSerializer(serializers.ModelSerializer):
    pet = PetListSerializer(read_only=True)
    doctor = DoctorListSerializer(read_only=True)
    pet_id = serializers.UUIDField(write_only=True)
    doctor_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Appointment
        fields = '__all__'
