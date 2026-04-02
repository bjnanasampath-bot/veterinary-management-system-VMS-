from django.db import models
from common.models import BaseModel
from apps.accounts.models import User


class Doctor(BaseModel):
    SPECIALIZATION_CHOICES = [
        ('general', 'General Practice'),
        ('surgery', 'Surgery'),
        ('dermatology', 'Dermatology'),
        ('dentistry', 'Dentistry'),
        ('cardiology', 'Cardiology'),
        ('orthopedics', 'Orthopedics'),
        ('ophthalmology', 'Ophthalmology'),
        ('neurology', 'Neurology'),
        ('oncology', 'Oncology'),
        ('other', 'Other'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile', null=True, blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    specialization = models.CharField(max_length=50, choices=SPECIALIZATION_CHOICES, default='general')
    license_number = models.CharField(max_length=100, unique=True)
    experience_years = models.PositiveIntegerField(default=0)
    qualification = models.CharField(max_length=200)
    consultation_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    available_days = models.JSONField(default=list)  # ['monday', 'tuesday', ...]
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to='doctors/', blank=True, null=True)

    class Meta:
        db_table = 'doctors'
        ordering = ['first_name', 'last_name']

    def __str__(self):
        return f"Dr. {self.first_name} {self.last_name} - {self.specialization}"

    @property
    def full_name(self):
        return f"Dr. {self.first_name} {self.last_name}"
