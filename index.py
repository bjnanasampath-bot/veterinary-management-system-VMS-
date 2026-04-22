import os
import sys
from pathlib import Path

# Add the backend directory to sys.path
# The repo root is where this file resides
BASE_DIR = Path(__file__).resolve().parent / 'backend'
sys.path.append(str(BASE_DIR))

# Set the settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.production')

# Import the WSGI application from Django
try:
    from config.wsgi import application
except ImportError as e:
    print(f"Error importing config.wsgi: {e}")
    print(f"sys.path: {sys.path}")
    print(f"BASE_DIR: {BASE_DIR}")
    raise

# Vercel expects 'app' or 'handler'
app = application
