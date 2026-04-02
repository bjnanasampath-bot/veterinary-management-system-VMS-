from django.db import models
from common.models import BaseModel
from apps.pets.models import Pet
from apps.doctors.models import Doctor


class Vaccination(BaseModel):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('overdue', 'Overdue'),
        ('skipped', 'Skipped'),
    ]

    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='vaccinations')
    doctor = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True, blank=True, related_name='vaccinations')
    vaccine_name = models.CharField(max_length=200)
    vaccine_brand = models.CharField(max_length=200, blank=True)
    batch_number = models.CharField(max_length=100, blank=True)
    vaccination_date = models.DateField()
    next_due_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completed')
    dose_number = models.PositiveIntegerField(default=1)
    notes = models.TextField(blank=True)
    cost = models.DecimalField(max_digits=8, decimal_places=2, default=0)

    class Meta:
        db_table = 'vaccinations'
        ordering = ['-vaccination_date']

    def __str__(self):
        return f"{self.pet.name} - {self.vaccine_name} ({self.vaccination_date})"
