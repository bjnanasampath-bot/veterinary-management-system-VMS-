import os
import sys
from pathlib import Path

# Add the backend directory to sys.path
# The repo root is one level up from this file
BASE_DIR = Path(__file__).resolve().parent.parent / 'backend'
sys.path.append(str(BASE_DIR))

# Set the settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.production')

# Import the WSGI application from Django
from config.wsgi import application

# Vercel expects 'app' or 'handler'
app = application

