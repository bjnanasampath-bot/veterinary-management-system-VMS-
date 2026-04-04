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


class LabTest(BaseModel):
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='lab_tests')
    doctor = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True, related_name='lab_tests')
    test_name = models.CharField(max_length=200)
    test_date = models.DateField()
    results = models.TextField(blank=True)
    status = models.CharField(max_length=50, choices=[
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ], default='pending')
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        db_table = 'lab_tests'
        ordering = ['-test_date']

    def __str__(self):
        return f"{self.test_name} for {self.pet.name}"


class Surgery(BaseModel):
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='surgeries')
    doctor = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True, related_name='surgeries')
    surgery_name = models.CharField(max_length=200)
    surgery_date = models.DateField()
    pre_op_notes = models.TextField(blank=True)
    post_op_notes = models.TextField(blank=True)
    status = models.CharField(max_length=50, choices=[
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ], default='scheduled')
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        db_table = 'surgeries'
        ordering = ['-surgery_date']

    def __str__(self):
        return f"{self.surgery_name} for {self.pet.name}"
