import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()
User.objects.filter(email='sampathnivas@gmail.com').delete()
User.objects.filter(email='sn@gamilcom').delete()
User.objects.filter(email='sn@gmail.com').delete()
print("Test users deleted!")
