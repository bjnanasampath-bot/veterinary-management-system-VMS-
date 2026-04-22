import os
import sys
from pathlib import Path

# Add the directory containing this file to sys.path
# This allows 'config.settings' to be found
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

from config.wsgi import application

# Vercel needs 'app' variable
app = application
