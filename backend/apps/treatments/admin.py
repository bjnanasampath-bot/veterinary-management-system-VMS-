from django.contrib import admin
from .models import Treatment

@admin.register(Treatment)
class TreatmentAdmin(admin.ModelAdmin):
    list_display = ['pet', 'treatment_name', 'doctor', 'treatment_date', 'cost']
    search_fields = ['pet__name', 'treatment_name', 'diagnosis']
    list_filter = ['follow_up_required', 'treatment_date']
