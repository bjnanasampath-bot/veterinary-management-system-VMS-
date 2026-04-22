from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.appointments.models import Appointment
from apps.billing.models import Bill
from .models import Notification

@receiver(post_save, sender=Appointment)
def appointment_notification(sender, instance, created, **kwargs):
    if created:
        # Notify doctor
        if instance.doctor and instance.doctor.user:
            Notification.objects.create(
                user=instance.doctor.user,
                title="New Appointment Scheduled",
                message=f"You have a new appointment for {instance.pet.name} on {instance.appointment_date}.",
                notification_type='info',
                link=f"/appointments/{instance.id}"
            )
        # Notify client (owner has a user account)
        if instance.pet.owner and instance.pet.owner.user:
            Notification.objects.create(
                user=instance.pet.owner.user,
                title="Appointment Request Confirmed",
                message=f"Your appointment for {instance.pet.name} is scheduled for {instance.appointment_date}.",
                notification_type='success',
                link=f"/appointments/{instance.id}"
            )
    elif 'status' in (kwargs.get('update_fields') or []):
        if instance.pet.owner and instance.pet.owner.user:
             Notification.objects.create(
                user=instance.pet.owner.user,
                title=f"Appointment Status: {instance.status.capitalize()}",
                message=f"Your appointment with {instance.doctor.full_name} for {instance.pet.name} is now {instance.status}.",
                notification_type='info',
                link=f"/appointments/{instance.id}"
            )

@receiver(post_save, sender=Bill)
def billing_notification(sender, instance, created, **kwargs):
    if created:
        if instance.pet.owner and instance.pet.owner.user:
            Notification.objects.create(
                user=instance.pet.owner.user,
                title="New Invoice Generated",
                message=f"An invoice of ₹{instance.total_amount} has been generated for {instance.pet.name}.",
                notification_type='warning',
                link=f"/billing/{instance.id}"
            )
    elif instance.status == 'paid':
        if instance.pet.owner and instance.pet.owner.user:
            Notification.objects.create(
                user=instance.pet.owner.user,
                title="Payment Successful",
                message=f"Thank you! Your payment of ₹{instance.total_amount} for {instance.pet.name} was successful.",
                notification_type='success',
                link=f"/billing/{instance.id}"
            )
