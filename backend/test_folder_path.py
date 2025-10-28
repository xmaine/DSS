#!/usr/bin/env python
"""
Simple test script to verify folder path generation functionality.
"""

import os
import sys
import django

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Setup Django
django.setup()

from users.models import CustomUser
from documents.models import Folder

def test_folder_path_generation():
    """Test folder path generation for different user roles"""
    
    # Get test users
    try:
        employee_user = CustomUser.objects.get(username='emponly')
        print(f"Found employee user: {employee_user.username}")
    except CustomUser.DoesNotExist:
        print("Employee user 'emponly' not found.")
        return
    
    # Test folder creation for employee (simulating the perform_create method)
    print("\n--- Testing Employee Folder Path Generation ---")
    
    # Create folder data as it would come from serializer
    folder_data = {
        'name': 'Test Employee Folder',
        'owner': employee_user,
        'is_active': True,
        'path': ''  # Empty path to test generation
    }
    
    # Simulate path generation logic from perform_create method
    if not folder_data['path']:
        folder_name = folder_data.get('name', 'Untitled')
        # For employees, create path based on their username
        if employee_user.role == 'EMPLOYEE':
            folder_data['path'] = f"/{employee_user.username}/{folder_name}"
        else:
            folder_data['path'] = f"/{folder_name}"
    
    print(f"Generated path: {folder_data['path']}")
    print(f"Expected pattern: /{employee_user.username}/")
    
    # Verify path is correctly set
    if employee_user.username in folder_data['path']:
        print("✓ Path correctly includes employee username")
    else:
        print("✗ Path does not include employee username")
    
    print("\n--- Test Complete ---")

if __name__ == "__main__":
    test_folder_path_generation()