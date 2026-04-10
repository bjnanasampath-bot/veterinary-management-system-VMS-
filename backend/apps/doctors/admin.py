from django.contrib import admin
from .models import Doctor, Attendance

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'specialization', 'email', 'phone', 'experience_years', 'is_active']
    search_fields = ['first_name', 'last_name', 'email', 'license_number']
    list_filter = ['specialization', 'is_active']

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['doctor', 'date', 'status', 'check_in_time']
    list_filter = ['status', 'date']
    search_fields = ['doctor__first_name', 'doctor__last_name']
