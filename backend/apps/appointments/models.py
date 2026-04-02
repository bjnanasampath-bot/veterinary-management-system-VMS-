from django.db import models
from common.models import BaseModel
from apps.pets.models import Pet
from apps.doctors.models import Doctor
from apps.accounts.models import User


class Appointment(BaseModel):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    ]
    TYPE_CHOICES = [
        ('checkup', 'Regular Checkup'),
        ('vaccination', 'Vaccination'),
        ('surgery', 'Surgery'),
        ('grooming', 'Grooming'),
        ('emergency', 'Emergency'),
        ('followup', 'Follow Up'),
        ('dental', 'Dental'),
        ('other', 'Other'),
    ]

    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True, related_name='appointments')
    booked_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='booked_appointments')
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    duration_minutes = models.PositiveIntegerField(default=30)
    appointment_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='checkup')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    reason = models.TextField()
    notes = models.TextField(blank=True)
    symptoms = models.TextField(blank=True)
    diagnosis = models.TextField(blank=True)
    prescription = models.TextField(blank=True)
    follow_up_date = models.DateField(null=True, blank=True)

    class Meta:
        db_table = 'appointments'
        ordering = ['-appointment_date', '-appointment_time']

    def __str__(self):
        return f"{self.pet.name} - {self.appointment_date} {self.appointment_time} ({self.status})"
