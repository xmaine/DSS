import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from documents.models import Folder
from users.models import CustomUser
from django.db.models import Q

# Get the employee user
emp = CustomUser.objects.get(username='emponly')
print(f"Employee: {emp.username}, Department: {emp.department}")

# Test the folder access logic
owned = Q(owner=emp)
shared = Q(shareditem__shared_with_user=emp)
dept = Q(owner__department=emp.department) if emp.department else Q()

# Get folders the employee should have access to
accessible_folders = Folder.objects.filter(owned | shared | dept).distinct()

print(f"\nFolders accessible to {emp.username}:")
for folder in accessible_folders:
    print(f"  - {folder.name} (ID: {folder.id}, Parent: {folder.parent_folder_id}, Owner: {folder.owner.username}, Owner Dept: {folder.owner.department})")

print(f"\nTotal accessible folders: {accessible_folders.count()}")

# Check if we're getting the right folders
expected_folder_names = ["Finance Documents", "Publication Documents", "Financial Reports", "Vendor Contracts"]
accessible_folder_names = [f.name for f in accessible_folders]

print(f"\nExpected folders: {expected_folder_names}")
print(f"Accessible folders: {[f.name for f in accessible_folders]}")

missing_folders = set(expected_folder_names) - set(accessible_folder_names)
extra_folders = set(accessible_folder_names) - set(expected_folder_names)

if missing_folders:
    print(f"Missing folders: {missing_folders}")
else:
    print("All expected folders are accessible")

if extra_folders:
    print(f"Extra folders: {extra_folders}")
else:
    print("No extra folders")