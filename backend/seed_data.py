#!/usr/bin/env python
"""
Seed script to populate the database with sample data.
Run: python seed_data.py (from backend directory with venv active)
"""
import os
import sys
import pkgutil

# Python 3.14 compatibility fix
if not hasattr(pkgutil, 'find_loader'):
    import importlib.util
    def find_loader(fullname):
        try:
            spec = importlib.util.find_spec(fullname)
            return spec.loader if spec is not None else None
        except Exception:
            return None
    pkgutil.find_loader = find_loader

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
import django
django.setup()

from apps.owners.models import Owner
from apps.pets.models import Pet
from apps.doctors.models import Doctor
from apps.appointments.models import Appointment
from apps.billing.models import Bill, BillItem
from apps.pharmacy.models import PharmacyItem
from apps.notifications.models import Notification
from django.contrib.auth import get_user_model
from datetime import date, timedelta, datetime
import random

User = get_user_model()

print("Seeding database with sample data...")

# Create Superuser if not exists
if not User.objects.filter(email='admin@example.com').exists():
    User.objects.create_superuser('admin@example.com', 'admin123', first_name='System', last_name='Administrator', role='admin')
    print("  Created Superuser: admin@example.com")

# Create Owners (Clients)
owners_data = [
    {'first_name': 'Ramesh', 'last_name': 'Kumar', 'email': 'ramesh.kumar@example.com',
     'phone': '9876543210', 'address': '123 MG Road', 'city': 'Hyderabad', 'state': 'Telangana', 'pincode': '500001'},
    {'first_name': 'Priya', 'last_name': 'Sharma', 'email': 'priya.sharma@example.com',
     'phone': '9876543211', 'address': '456 Jubilee Hills', 'city': 'Hyderabad', 'state': 'Telangana', 'pincode': '500033'},
    {'first_name': 'Suresh', 'last_name': 'Reddy', 'email': 'suresh.reddy@example.com',
     'phone': '9876543212', 'address': '789 Banjara Hills', 'city': 'Hyderabad', 'state': 'Telangana', 'pincode': '500034'},
    {'first_name': 'Anitha', 'last_name': 'Patel', 'email': 'anitha.patel@example.com',
     'phone': '9876543213', 'address': '321 Madhapur', 'city': 'Hyderabad', 'state': 'Telangana', 'pincode': '500081'},
    {'first_name': 'Vijay', 'last_name': 'Singh', 'email': 'vijay.singh@example.com',
     'phone': '9876543214', 'address': '654 Gachibowli', 'city': 'Hyderabad', 'state': 'Telangana', 'pincode': '500032'},
]

owners = []
for data in owners_data:
    owner, created = Owner.objects.get_or_create(email=data['email'], defaults=data)
    owners.append(owner)
    # Create corresponding user for client portal
    if not User.objects.filter(email=data['email']).exists():
        User.objects.create_user(
            email=data['email'], 
            password='password123',
            first_name=data['first_name'],
            last_name=data['last_name'],
            role='client'
        )
    print(f"  {'Created' if created else 'Exists'}: Owner {owner.full_name}")

# Create Pets
pets_data = [
    {'owner': owners[0], 'name': 'Bruno', 'species': 'dog', 'breed': 'Labrador', 'gender': 'male',
     'date_of_birth': date(2020, 3, 15), 'weight': 28.5, 'color': 'Golden Brown', 'is_neutered': True},
    {'owner': owners[0], 'name': 'Whiskers', 'species': 'cat', 'breed': 'Persian', 'gender': 'female',
     'date_of_birth': date(2021, 6, 20), 'weight': 4.2, 'color': 'White', 'is_neutered': True},
    {'owner': owners[1], 'name': 'Max', 'species': 'dog', 'breed': 'German Shepherd', 'gender': 'male',
     'date_of_birth': date(2019, 11, 8), 'weight': 35.0, 'color': 'Black and Tan', 'is_neutered': False},
    {'owner': owners[2], 'name': 'Luna', 'species': 'cat', 'breed': 'Siamese', 'gender': 'female',
     'date_of_birth': date(2022, 1, 5), 'weight': 3.8, 'color': 'Cream and Brown'},
    {'owner': owners[2], 'name': 'Charlie', 'species': 'dog', 'breed': 'Beagle', 'gender': 'male',
     'date_of_birth': date(2021, 8, 14), 'weight': 10.5, 'color': 'Tricolor'},
    {'owner': owners[3], 'name': 'Tweety', 'species': 'bird', 'breed': 'Budgerigar', 'gender': 'unknown',
     'date_of_birth': date(2023, 2, 28), 'weight': 0.08, 'color': 'Green and Yellow'},
    {'owner': owners[4], 'name': 'Rocky', 'species': 'dog', 'breed': 'Rottweiler', 'gender': 'male',
     'date_of_birth': date(2020, 7, 22), 'weight': 42.0, 'color': 'Black and Mahogany', 'is_neutered': True},
    {'owner': owners[1], 'name': 'Bella', 'species': 'dog', 'breed': 'Golden Retriever', 'gender': 'female',
     'date_of_birth': date(2022, 4, 10), 'weight': 27.0, 'color': 'Golden', 'is_neutered': True},
]

pets = []
for data in pets_data:
    pet, created = Pet.objects.get_or_create(name=data['name'], owner=data['owner'], defaults=data)
    pets.append(pet)
    print(f"  {'Created' if created else 'Exists'}: Pet {pet.name}")

# Create Doctors
doctors_data = [
    {'first_name': 'Arun', 'last_name': 'Mehta', 'email': 'dr.arun.mehta@vetcare.com',
     'phone': '9900112233', 'specialization': 'general', 'license_number': 'VET-2024-001',
     'experience_years': 8, 'qualification': 'BVSc, MVSc (General Practice)',
     'consultation_fee': 500, 'available_days': ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
     'bio': 'Experienced general practitioner with expertise in small animals.'},
    {'first_name': 'Deepa', 'last_name': 'Nair', 'email': 'dr.deepa.nair@vetcare.com',
     'phone': '9900112234', 'specialization': 'surgery', 'license_number': 'VET-2024-002',
     'experience_years': 12, 'qualification': 'BVSc, MVSc (Surgery), PhD',
     'consultation_fee': 1000, 'available_days': ['monday', 'wednesday', 'friday'],
     'bio': 'Specialist in small animal surgery with 12 years of experience.'},
]

doctors = []
for data in doctors_data:
    doctor, created = Doctor.objects.get_or_create(email=data['email'], defaults=data)
    doctors.append(doctor)
    # Create corresponding user for doctor login
    if not User.objects.filter(email=data['email']).exists():
        User.objects.create_user(
            email=data['email'], 
            password='password123',
            first_name=data['first_name'],
            last_name=data['last_name'],
            role='doctor'
        )
    print(f"  {'Created' if created else 'Exists'}: Doctor Dr. {doctor.first_name}")


# Create Pharmacy Items
pharmacy_data = [
    {'name': 'Amoxicillin', 'category': 'medication', 'stock_quantity': 500, 'unit_price': 15.0, 'description': 'Antibiotic for various infections.'},
    {'name': 'Carprofen', 'category': 'medication', 'stock_quantity': 200, 'unit_price': 45.0, 'description': 'Pain relief and anti-inflammatory.'},
    {'name': 'Bravecto', 'category': 'medication', 'stock_quantity': 30, 'unit_price': 1200.0, 'description': 'Flea and tick protection.'},
    {'name': 'Rabies Vaccine', 'category': 'vaccine', 'stock_quantity': 15, 'unit_price': 650.0, 'description': 'Annual rabies vaccination.'},
    {'name': 'Ear Cleaner', 'category': 'supply', 'stock_quantity': 45, 'unit_price': 350.0, 'description': 'Gentle ear cleaning solution.'},
]

for data in pharmacy_data:
    item, created = PharmacyItem.objects.get_or_create(name=data['name'], defaults=data)
    print(f"  {'Created' if created else 'Exists'}: Pharmacy Item {item.name}")


# Create Appointments
print("Seeding Appointments and Billing...")
today = date.today()
statuses = ['scheduled', 'confirmed', 'completed', 'in_progress']

for i in range(15):
    p = random.choice(pets)
    d = random.choice(doctors)
    # Some past, some future
    day_offset = random.randint(-15, 15)
    appt_date = today + timedelta(days=day_offset)
    
    status = 'completed' if day_offset < 0 else random.choice(['scheduled', 'confirmed', 'in_progress'])
    
    appt_type = random.choice(['checkup', 'vaccination', 'surgery', 'dental', 'followup'])
    
    appt = Appointment.objects.create(
        pet=p,
        doctor=d,
        appointment_date=appt_date,
        appointment_time="10:00:00",
        appointment_type=appt_type,
        reason=random.choice(['Regular Checkup', 'Vaccination', 'Skin Allergy', 'Limping', 'Dental Cleaning']),
        status=status,
        symptoms="Sample symptoms for " + p.name,
        diagnosis="Sample diagnosis" if status == 'completed' else ""
    )

    
    # If completed, create a bill
    if status == 'completed':
        bill = Bill.objects.create(
            appointment=appt,
            pet=p,
            total_amount=d.consultation_fee,
            status='paid' if random.random() > 0.3 else 'pending',
            payment_method='cash' if random.random() > 0.5 else 'card'
        )
        # Add consultation fee item
        BillItem.objects.create(
            bill=bill,
            description="Consultation Fee - " + d.first_name,
            item_type='consultation',
            quantity=1,
            unit_price=d.consultation_fee,
            total_price=d.consultation_fee
        )
        # Maybe add a medicine
        if random.random() > 0.5:
            med = random.choice(PharmacyItem.objects.all())
            qty = random.randint(1, 5)
            med_total = med.unit_price * qty
            BillItem.objects.create(
                bill=bill,
                description=med.name,
                item_type='medication',
                quantity=qty,
                unit_price=med.unit_price,
                total_price=med_total
            )
            bill.total_amount += med_total
            bill.save()


print("\nDatabase seeding complete!")
print(f"  {Owner.objects.count()} Owners")
print(f"  {Pet.objects.count()} Pets")
print(f"  {Doctor.objects.count()} Doctors")
print(f"  {Appointment.objects.count()} Appointments")
print(f"  {Bill.objects.count()} Bills")
print(f"  {PharmacyItem.objects.count()} Pharmacy Items")

