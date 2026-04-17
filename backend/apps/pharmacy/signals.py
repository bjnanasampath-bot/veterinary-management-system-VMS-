from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.core.mail import send_mail
from apps.accounts.models import User
from .models import PharmacyItem

@receiver(pre_save, sender=PharmacyItem)
def auto_replenish_stock(sender, instance, **kwargs):
    # Only act on existing items (not on creation, unless they are created with low stock)
    LOW_STOCK_THRESHOLD = 5
    AUTO_REFILLED_AMOUNT = 50

    if instance.stock_quantity < LOW_STOCK_THRESHOLD:
        print(f"Low stock detected for {instance.name}. Auto-replenishing...")
        
        # Auto replenish
        instance.stock_quantity += AUTO_REFILLED_AMOUNT
        
        # Gather emails to notify
        admins_and_doctors = User.objects.filter(role__in=['admin', 'doctor']).values_list('email', flat=True)
        recipient_list = list(admins_and_doctors)
        
        if recipient_list:
            subject = f"Inventory Alert: {instance.name} Auto-Restocked"
            message = (
                f"Hello,\n\n"
                f"The stock for pharmacy item '{instance.name}' dropped below {LOW_STOCK_THRESHOLD}.\n"
                f"It has been automatically restocked.\n\n"
                f"New Stock Quantity: {instance.stock_quantity}\n"
                f"Item Category: {instance.get_category_display()}\n\n"
                f"System Notification\nVetCare Management System"
            )
            
            try:
                send_mail(
                    subject,
                    message,
                    'no-reply@vetcare.com',
                    recipient_list,
                    fail_silently=True,
                )
            except Exception as e:
                print(f"Failed to send notification email: {e}")
