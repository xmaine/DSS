import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from documents.models import Folder
from users.models import CustomUser

def test_get_folders():
    try:
        # Get all folders
        folders = Folder.objects.all()
        print("All folders:")
        for folder in folders:
            print(f"  ID: {folder.id}, Name: {folder.name}, Owner ID: {folder.owner.id}, Owner Username: {folder.owner.username}, Path: {folder.path}")
        
        # Get the emponly user
        user = CustomUser.objects.get(username='emponly')
        print(f"\nUser: {user.username}, ID: {user.id}, Department: {user.department}")
        
        # Test the filter that would be used in the get_queryset method
        from django.db.models import Q
        owned_folders = Q(owner=user)
        department_folders = Q(owner__department=user.department) if user.department else Q()
        queryset = Folder.objects.filter(owned_folders | department_folders).distinct()
        
        print(f"\nFolders accessible to {user.username}:")
        for folder in queryset:
            folder_type = ""
            if folder.owner == user:
                folder_type = " (PERSONAL FOLDER)"
            elif folder.owner.department == user.department:
                folder_type = " (Department folder)"
            else:
                folder_type = " (Shared with user)"
            print(f"  - {folder.name} (ID: {folder.id}){folder_type}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_get_folders()