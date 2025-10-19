import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from documents.models import Folder
from users.models import CustomUser

def test_folder_creation():
    try:
        # Get the emponly user
        user = CustomUser.objects.get(username='emponly')
        print(f"User: {user.username}, Department: {user.department}")
        
        # Try to create the personal folder
        personalFolderName = f"{user.username}'s Documents"
        path = f"/{user.department} Documents/{personalFolderName}"
        
        print(f"Attempting to create folder: {personalFolderName}")
        print(f"Path: {path}")
        
        # Create the personal folder
        personal_folder = Folder.objects.create(
            name=personalFolderName,
            owner=user,
            path=path,
            is_active=True
        )
        
        print(f"Folder created successfully: {personal_folder.name} (ID: {personal_folder.id})")
        return True
        
    except Exception as e:
        print(f"Error creating folder: {e}")
        return False

if __name__ == "__main__":
    test_folder_creation()