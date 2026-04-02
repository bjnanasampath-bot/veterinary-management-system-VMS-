from django.contrib import admin
from .models import Doctor

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'specialization', 'email', 'phone', 'experience_years', 'is_active']
    search_fields = ['first_name', 'last_name', 'email', 'license_number']
    list_filter = ['specialization', 'is_active']
