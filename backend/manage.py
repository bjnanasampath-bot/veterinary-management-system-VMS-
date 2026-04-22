#!/usr/bin/env python
import os
import sys
import pkgutil

if not hasattr(pkgutil, 'find_loader'):
    import importlib.util
    def find_loader(fullname):
        try:
            spec = importlib.util.find_spec(fullname)
            return spec.loader if spec is not None else None
        except Exception:
            return None
    pkgutil.find_loader = find_loader

# Add the directory containing manage.py to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')

def main():
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError("Couldn't import Django.") from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
