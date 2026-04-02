from django.contrib import admin
from .models import Owner

@admin.register(Owner)
class OwnerAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'phone', 'city', 'is_active']
    search_fields = ['first_name', 'last_name', 'email', 'phone']
    list_filter = ['city', 'is_active']
