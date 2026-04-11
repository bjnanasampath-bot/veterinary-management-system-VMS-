import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.settings.models import SystemSetting

def seed_settings():
    settings = [
        {'key': 'clinic_name', 'value': 'VetCare Clinic', 'description': 'Name of the veterinary clinic'},
        {'key': 'tax_percentage', 'value': '18', 'description': 'Default GST/VAT percentage'},
        {'key': 'currency', 'value': 'INR', 'description': 'System currency code'},
        {'key': 'contact_email', 'value': 'support@vetcare.com', 'description': 'Support email address'},
    ]

    for s in settings:
        obj, created = SystemSetting.objects.get_or_create(key=s['key'], defaults=s)
        if not created:
            obj.value = s['value']
            obj.description = s['description']
            obj.save()
            print(f"Updated setting: {s['key']}")
        else:
            print(f"Created setting: {s['key']}")

if __name__ == '__main__':
    seed_settings()
