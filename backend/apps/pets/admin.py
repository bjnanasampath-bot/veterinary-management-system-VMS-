from django.contrib import admin
from .models import Pet

@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):
    list_display = ['name', 'species', 'breed', 'owner', 'gender', 'is_active']
    search_fields = ['name', 'breed', 'microchip_id', 'owner__first_name']
    list_filter = ['species', 'gender', 'is_neutered', 'is_active']
