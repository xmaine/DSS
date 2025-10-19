import os
import django
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from documents.models import Folder
from users.models import CustomUser
from documents.serializers import FolderSerializer

def test_api_simulation():
    try:
        # Get the emponly user
        user = CustomUser.objects.get(username='emponly')
        print(f"User: {user.username}, ID: {user.id}, Department: {user.department}")
        
        # Simulate what the get_queryset method does
        from django.db.models import Q
        owned_folders = Q(owner=user)
        department_folders = Q(owner__department=user.department) if user.department else Q()
        queryset = Folder.objects.filter(owned_folders | department_folders).distinct()
        
        # Serialize the folders like the API would
        serializer = FolderSerializer(queryset, many=True)
        folders_data = serializer.data
        
        print(f"\nSerialized folders data:")
        print(json.dumps(folders_data, indent=2))
        
        # Test the folder matching logic
        personalFolderName = f"{user.username}'s Documents"
        print(f"\nLooking for folder named: {personalFolderName}")
        
        personalFolder = None
        for folder in folders_data:
            isNameMatch = folder['name'] == personalFolderName
            isOwnerMatch = folder['owner'] == user.id
            print(f"Checking folder {folder['name']} (ID: {folder['id']}) - Name match: {isNameMatch}, Owner match: {isOwnerMatch} (folder['owner']: {folder['owner']}, user.id: {user.id})")
            if isNameMatch and isOwnerMatch:
                personalFolder = folder
                break
        
        if personalFolder:
            print(f"Personal folder found: {personalFolder['name']}")
        else:
            print("Personal folder not found")
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_api_simulation()