from django.db import models
from common.models import BaseModel
from apps.pets.models import Pet
from apps.doctors.models import Doctor

class PharmacyItem(BaseModel):
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=100, choices=[
        ('medication', 'Medication'),
        ('supply', 'Supply'),
        ('vaccine', 'Vaccine'),
        ('other', 'Other')
    ], default='medication')
    stock_quantity = models.IntegerField(default=0)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    expiry_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        db_table = 'pharmacy_items'
        ordering = ['name']

    def __str__(self):
        return self.name

class Prescription(BaseModel):
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='prescriptions')
    doctor = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True, related_name='prescriptions')
    medication = models.ForeignKey(PharmacyItem, on_delete=models.SET_NULL, null=True, related_name='prescriptions', blank=True)
    
    # Text fallback if medication isn't in inventory
    medication_name = models.CharField(max_length=200)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)
    duration_days = models.IntegerField(default=1)
    status = models.CharField(max_length=50, choices=[
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ], default='active')
    notes = models.TextField(blank=True)

    class Meta:
        db_table = 'prescriptions'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.pet.name} - {self.medication_name}"
