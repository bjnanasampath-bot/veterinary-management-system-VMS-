from django.db import models
from common.models import BaseModel
from apps.pets.models import Pet
from apps.appointments.models import Appointment
from apps.accounts.models import User


class Bill(BaseModel):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('partial', 'Partially Paid'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('upi', 'UPI'),
        ('netbanking', 'Net Banking'),
        ('cheque', 'Cheque'),
    ]

    bill_number = models.CharField(max_length=50, unique=True)
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='bills')
    appointment = models.ForeignKey(Appointment, on_delete=models.SET_NULL, null=True, blank=True, related_name='bills')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_bills')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_percent = models.DecimalField(max_digits=5, decimal_places=2, default=18)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    due_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, blank=True)
    payment_date = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    due_date = models.DateField(null=True, blank=True)

    class Meta:
        db_table = 'bills'
        ordering = ['-created_at']

    def __str__(self):
        return f"Bill #{self.bill_number} - {self.pet.name} ({self.status})"

    def save(self, *args, **kwargs):
        if not self.bill_number:
            import uuid
            self.bill_number = f"VET-{str(uuid.uuid4())[:8].upper()}"
        self.due_amount = self.total_amount - self.paid_amount
        super().save(*args, **kwargs)


class BillItem(models.Model):
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=300)
    item_type = models.CharField(max_length=50, choices=[
        ('consultation', 'Consultation'), ('treatment', 'Treatment'),
        ('vaccination', 'Vaccination'), ('medication', 'Medication'),
        ('lab', 'Lab Test'), ('grooming', 'Grooming'), ('other', 'Other')
    ])
    quantity = models.DecimalField(max_digits=8, decimal_places=2, default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        self.total_price = self.quantity * self.unit_price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.description} x{self.quantity}"
