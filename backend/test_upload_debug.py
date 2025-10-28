#!/usr/bin/env python
"""
Test script to debug file upload functionality
"""

import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from documents.models import Document, Folder, DocumentVersion
from django.core.files.base import ContentFile

def test_upload_functionality():
    """Test the document upload functionality"""
    print("Testing document upload functionality...")
    
    # Get user model
    User = get_user_model()
    
    try:
        # Get or create a test user
        user, created = User.objects.get_or_create(
            username='testuser',
            defaults={
                'email': 'test@example.com',
                'role': 'EMPLOYEE'
            }
        )
        if created:
            user.set_password('testpass123')
            user.save()
            print("Created test user")
        else:
            print("Using existing test user")
            
        # Get or create a test folder
        folder, created = Folder.objects.get_or_create(
            name='Test Folder',
            owner=user,
            defaults={
                'path': '/Test Folder',
                'is_active': True
            }
        )
        if created:
            print("Created test folder")
        else:
            print("Using existing test folder")
            
        # Create a test document
        document = Document.objects.create(
            title='Test Document',
            uploader=user,
            folder=folder,
            is_active=True
        )
        print(f"Created document: {document.title}")
        
        # Create a test document version
        test_content = b"This is a test document content"
        document_version = DocumentVersion.objects.create(
            document=document,
            version_number=1.0,
            file_size=len(test_content),
            file_type='text/plain',
            uploaded_by=user,
            is_current=True
        )
        
        # Save the file content
        document_version.file.save(
            'test_document.txt',
            ContentFile(test_content),
            save=True
        )
        print(f"Created document version: {document_version}")
        
        # Update document with current version
        document.current_version = document_version
        document.save()
        print("Updated document with current version")
        
        print("Upload test completed successfully!")
        return True
        
    except Exception as e:
        print(f"Error during upload test: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    test_upload_functionality()