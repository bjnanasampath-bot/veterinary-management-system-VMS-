from django.contrib import admin
from .models import Vaccination

@admin.register(Vaccination)
class VaccinationAdmin(admin.ModelAdmin):
    list_display = ['pet', 'vaccine_name', 'vaccination_date', 'next_due_date', 'status']
    list_filter = ['status', 'vaccination_date']
    search_fields = ['pet__name', 'vaccine_name', 'batch_number']
