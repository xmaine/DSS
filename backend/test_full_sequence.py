import os
import django
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from documents.models import Folder
from users.models import CustomUser
from documents.serializers import FolderSerializer
from django.test import Client
from django.urls import reverse

def test_full_sequence():
    try:
        # Create a test client
        client = Client()
        
        # Login as emponly user
        login_response = client.login(username='emponly', password='emponly')  # Assuming default password
        print(f"Login successful: {login_response}")
        
        if not login_response:
            # Try to create a user and login
            user, created = CustomUser.objects.get_or_create(
                username='emponly',
                defaults={
                    'password': 'pbkdf2_sha256$260000$xyz$abc=',  # dummy password hash
                    'role': 'EMPLOYEE',
                    'department': 'Publication'
                }
            )
            print(f"User {'created' if created else 'found'}: {user.username}")
            
            # Set a simple password for testing
            user.set_password('emponly')
            user.save()
            
            login_response = client.login(username='emponly', password='emponly')
            print(f"Login successful after user creation: {login_response}")
        
        if not login_response:
            print("Failed to login")
            return
            
        # Test 1: Get folders (like getFolders API call)
        print("\n=== Test 1: Get Folders ===")
        folders_response = client.get('/api/folders/')
        print(f"Get folders status: {folders_response.status_code}")
        if folders_response.status_code == 200:
            folders_data = folders_response.json()
            print(f"Number of folders: {len(folders_data)}")
            print("Folders data:")
            print(json.dumps(folders_data, indent=2))
            
            # Check if emponly's Documents folder exists
            user = CustomUser.objects.get(username='emponly')
            personalFolderName = f"{user.username}'s Documents"
            personalFolder = next((f for f in folders_data if f['name'] == personalFolderName and f['owner'] == user.id), None)
            
            if personalFolder:
                print(f"Personal folder found: {personalFolder['name']}")
            else:
                print("Personal folder not found, attempting to create...")
                
                # Test 2: Create folder (like createFolder API call)
                print("\n=== Test 2: Create Folder ===")
                folder_data = {
                    'name': personalFolderName,
                    'owner': user.id,
                    'path': f"/{user.department} Documents/{personalFolderName}",
                    'is_active': True
                }
                print(f"Creating folder with data: {folder_data}")
                
                create_response = client.post('/api/folders/', folder_data, content_type='application/json')
                print(f"Create folder status: {create_response.status_code}")
                if create_response.status_code == 201:
                    created_folder = create_response.json()
                    print(f"Folder created successfully: {created_folder}")
                else:
                    print(f"Failed to create folder. Response: {create_response.content}")
                    # Try to parse error response
                    try:
                        error_data = create_response.json()
                        print(f"Error details: {error_data}")
                    except:
                        print("Could not parse error response")
        else:
            print(f"Failed to get folders. Response: {folders_response.content}")
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_full_sequence()