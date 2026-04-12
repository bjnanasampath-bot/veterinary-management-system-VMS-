import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.accounts.models import User
from apps.doctors.models import Doctor
from apps.owners.models import Owner

print("Fixing Doctor Users...")
for doctor in Doctor.objects.all():
    if not doctor.user:
        user = User.objects.filter(email=doctor.email).first()
        if not user:
            user = User.objects.create_user(
                email=doctor.email,
                first_name=doctor.first_name,
                last_name=doctor.last_name,
                phone=doctor.phone,
                role='doctor',
                password='Password@123'
            )
            print(f"Created user for {doctor.email}")
        doctor.user = user
        doctor.save()
        print(f"Linked user to doctor {doctor.full_name}")

print("Fixing Owner Users...")
for owner in Owner.objects.all():
    if not owner.user:
        user = User.objects.filter(email=owner.email).first()
        if not user:
            user = User.objects.create_user(
                email=owner.email,
                first_name=owner.first_name,
                last_name=owner.last_name,
                phone=owner.phone,
                role='client',
                password='Password@123'
            )
            print(f"Created user for {owner.email}")
        owner.user = user
        owner.save()
        print(f"Linked user to owner {owner.full_name}")

print("Done!")
