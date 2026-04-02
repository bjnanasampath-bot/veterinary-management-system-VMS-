from django.contrib import admin
from .models import Bill, BillItem

class BillItemInline(admin.TabularInline):
    model = BillItem
    extra = 1

@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = ['bill_number', 'pet', 'total_amount', 'paid_amount', 'due_amount', 'status']
    list_filter = ['status', 'payment_method']
    search_fields = ['bill_number', 'pet__name']
    inlines = [BillItemInline]
