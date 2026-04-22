from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Sum
from .models import Bill, BillItem
from decimal import Decimal

@receiver([post_save, post_delete], sender=BillItem)
def update_bill_totals(sender, instance, **kwargs):
    bill = instance.bill
    
    # Recalculate subtotal
    items = bill.items.all()
    subtotal = items.aggregate(total=Sum('total_price'))['total'] or Decimal('0.00')
    bill.subtotal = subtotal
    
    # Recalculate discount
    discount = subtotal * (bill.discount_percent / Decimal('100.00'))
    bill.discount_amount = discount
    
    # Recalculate tax
    taxable = subtotal - discount
    bill.tax_amount = taxable * (bill.tax_percent / Decimal('100.00'))
    
    # Set final total
    bill.total_amount = taxable + bill.tax_amount
    
    # Update due amount
    bill.due_amount = bill.total_amount - bill.paid_amount
    
    # Save the bill
    # Avoid recursion: explicitly update only these fields
    Bill.objects.filter(pk=bill.pk).update(
        subtotal=bill.subtotal,
        discount_amount=bill.discount_amount,
        tax_amount=bill.tax_amount,
        total_amount=bill.total_amount,
        due_amount=bill.due_amount
    )
