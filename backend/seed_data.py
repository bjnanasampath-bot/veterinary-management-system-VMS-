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

print("🌱 Seeding database with sample data...")

# Create Owners
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
    status = "✅ Created" if created else "⏭ Already exists"
    print(f"  {status}: Owner {owner.full_name}")

# Create Pets
from datetime import date
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

for data in pets_data:
    pet, created = Pet.objects.get_or_create(
        name=data['name'], owner=data['owner'],
        defaults=data
    )
    status = "✅ Created" if created else "⏭ Already exists"
    print(f"  {status}: Pet {pet.name} ({pet.species}) - Owner: {pet.owner.full_name}")

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
    {'first_name': 'Kiran', 'last_name': 'Rao', 'email': 'dr.kiran.rao@vetcare.com',
     'phone': '9900112235', 'specialization': 'dermatology', 'license_number': 'VET-2024-003',
     'experience_years': 6, 'qualification': 'BVSc, MVSc (Dermatology)',
     'consultation_fee': 700, 'available_days': ['tuesday', 'thursday', 'saturday'],
     'bio': 'Skin specialist for dogs and cats.'},
    {'first_name': 'Shalini', 'last_name': 'Joshi', 'email': 'dr.shalini.joshi@vetcare.com',
     'phone': '9900112236', 'specialization': 'dentistry', 'license_number': 'VET-2024-004',
     'experience_years': 5, 'qualification': 'BVSc, MVSc (Dental)',
     'consultation_fee': 800, 'available_days': ['monday', 'tuesday', 'thursday', 'friday'],
     'bio': 'Dental health specialist for all pets.'},
    {'first_name': 'Rajesh', 'last_name': 'Gupta', 'email': 'dr.rajesh.gupta@vetcare.com',
     'phone': '9900112237', 'specialization': 'cardiology', 'license_number': 'VET-2024-005',
     'experience_years': 15, 'qualification': 'BVSc, MVSc (Cardiology), PhD',
     'consultation_fee': 1200, 'available_days': ['wednesday', 'friday'],
     'bio': 'Cardiac health specialist with over 15 years of experience.'},
]

for data in doctors_data:
    doctor, created = Doctor.objects.get_or_create(email=data['email'], defaults=data)
    status = "✅ Created" if created else "⏭ Already exists"
    print(f"  {status}: Doctor Dr. {doctor.first_name} {doctor.last_name} ({doctor.specialization})")

print("\n🎉 Database seeding complete!")
print(f"  ✅ {Owner.objects.count()} Owners")
print(f"  ✅ {Pet.objects.count()} Pets")
print(f"  ✅ {Doctor.objects.count()} Doctors")
