from rest_framework import serializers
from .models import Vaccination


class VaccinationSerializer(serializers.ModelSerializer):
    pet_name = serializers.CharField(source='pet.name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.full_name', read_only=True)
    is_overdue = serializers.SerializerMethodField()

    class Meta:
        model = Vaccination
        fields = '__all__'

    def get_is_overdue(self, obj):
        from datetime import date
        if obj.next_due_date and obj.next_due_date < date.today() and obj.status != 'completed':
            return True
        return False
