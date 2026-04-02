from rest_framework import serializers
from .models import Treatment


class TreatmentSerializer(serializers.ModelSerializer):
    pet_name = serializers.CharField(source='pet.name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.full_name', read_only=True)

    class Meta:
        model = Treatment
        fields = '__all__'
