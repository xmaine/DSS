import os
import django
import json
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from documents.models import Folder
from users.models import CustomUser
from documents.serializers import FolderSerializer

# Get the employee user
emp = CustomUser.objects.get(username='emponly')
print(f"Employee: {emp.username}, Department: {emp.department}")

# Get folders the employee should have access to (using the same logic as in FolderViewSet)
from django.db.models import Q
owned = Q(owner=emp)
shared = Q(shareditem__shared_with_user=emp)
dept = Q(owner__department=emp.department) if emp.department else Q()
accessible_folders = Folder.objects.filter(owned | shared | dept).distinct()

print(f"\nFolders accessible to {emp.username}:")
for folder in accessible_folders:
    print(f"  - {folder.name} (ID: {folder.id}, Parent: {folder.parent_folder_id})")

# Serialize the folders using the same serializer as the API
serializer = FolderSerializer(accessible_folders, many=True)
serialized_data = serializer.data

print(f"\nSerialized folder data:")
print(json.dumps(serialized_data, indent=2, default=str))