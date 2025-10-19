#!/usr/bin/env python
"""
Script to create personal folders for all employees.
This ensures that each employee has their personal folder created.
"""

import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.core.management import execute_from_command_line

if __name__ == '__main__':
    # Run the create_employee_folders management command
    execute_from_command_line(['manage.py', 'create_employee_folders'])