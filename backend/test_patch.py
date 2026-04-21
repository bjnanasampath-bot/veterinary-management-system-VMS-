import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from rest_framework.test import APIClient
from apps.accounts.models import User
from apps.pharmacy.models import PharmacyItem

user = User.objects.filter().first() # just any user to avoid DoesNotExist. Actually let's find admin.
user = User.objects.filter(role='admin').first() or User.objects.first()
user.role = 'admin'
user.save()

client = APIClient()
client.force_authenticate(user=user)

item = PharmacyItem.objects.first()
print("Item name before:", item.name)
print("Item stock before:", item.stock_quantity)

res = client.patch(f'/api/pharmacy/items/{item.id}/', {'stock_quantity': item.stock_quantity + 50}, format='json')
print("Status:", res.status_code)
print("Response:", res.data)
