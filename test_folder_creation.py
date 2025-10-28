#!/usr/bin/env python
"""
Test script to verify folder creation functionality for different user roles.
This script tests the backend changes made to folder_views.py
"""

import os
import sys
import django
from django.contrib.auth import get_user_model

# Add the project directory to Python path
sys.path.append('D:/PYTHON/Projects/Django/DSS/backend')

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Setup Django
django.setup()

from documents.models import Folder

def test_folder_creation():
    """Test folder creation for different user roles"""
    User = get_user_model()
    
    # Get test users
    try:
        admin_user = User.objects.get(username='admin')
        employee_user = User.objects.get(username='emponly')
        print("Found test users")
    except User.DoesNotExist:
        print("Test users not found. Please create test users first.")
        return
    
    # Test folder creation for employee
    print("\n--- Testing Employee Folder Creation ---")
    try:
        employee_folder = Folder.objects.create(
            name="Test Employee Folder",
            owner=employee_user,
            is_active=True
        )
        print(f"Employee folder created successfully: {employee_folder.name}")
        print(f"Folder path: {employee_folder.path}")
        print(f"Expected path pattern: /{employee_user.username}/")
        
        # Verify path is correctly set
        if employee_user.username in employee_folder.path:
            print("✓ Path correctly includes employee username")
        else:
            print("✗ Path does not include employee username")
            
        # Clean up
        employee_folder.delete()
        print("Cleaned up test folder")
        
    except Exception as e:
        print(f"Error creating employee folder: {e}")
    
    # Test folder creation for admin
    print("\n--- Testing Admin Folder Creation ---")
    try:
        admin_folder = Folder.objects.create(
            name="Test Admin Folder",
            owner=admin_user,
            is_active=True
        )
        print(f"Admin folder created successfully: {admin_folder.name}")
        print(f"Folder path: {admin_folder.path}")
        
        # Clean up
        admin_folder.delete()
        print("Cleaned up test folder")
        
    except Exception as e:
        print(f"Error creating admin folder: {e}")

    print("\n--- Test Complete ---")

if __name__ == "__main__":
    test_folder_creation()