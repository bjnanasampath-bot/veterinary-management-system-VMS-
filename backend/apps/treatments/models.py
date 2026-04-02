from django.db import models
from common.models import BaseModel
from apps.pets.models import Pet
from apps.doctors.models import Doctor
from apps.appointments.models import Appointment


class Treatment(BaseModel):
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='treatments')
    doctor = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True, related_name='treatments')
    appointment = models.ForeignKey(Appointment, on_delete=models.SET_NULL, null=True, blank=True, related_name='treatments')
    treatment_name = models.CharField(max_length=200)
    description = models.TextField()
    diagnosis = models.TextField()
    prescription = models.TextField(blank=True)
    medications = models.JSONField(default=list)  # [{name, dosage, frequency, duration}]
    treatment_date = models.DateField()
    follow_up_required = models.BooleanField(default=False)
    follow_up_date = models.DateField(null=True, blank=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    notes = models.TextField(blank=True)

    class Meta:
        db_table = 'treatments'
        ordering = ['-treatment_date']

    def __str__(self):
        return f"{self.pet.name} - {self.treatment_name} ({self.treatment_date})"
