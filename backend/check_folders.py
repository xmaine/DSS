import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from documents.models import Folder
from users.models import CustomUser

print("=== All Folders ===")
folders = Folder.objects.all()
for f in folders:
    owner_name = f.owner.username if f.owner else "None"
    print(f'{f.name} (ID: {f.id}, Owner: {owner_name})')

print("\n=== Checking emponly user ===")
try:
    user = CustomUser.objects.get(username='emponly')
    print(f"User: {user.username}, ID: {user.id}, Department: {user.department}")
    
    # Check if personal folder exists
    personal_folder_name = f"{user.username}'s Documents"
    personal_folders = Folder.objects.filter(name=personal_folder_name, owner=user)
    print(f"Personal folder '{personal_folder_name}' exists: {personal_folders.exists()}")
    
    if personal_folders.exists():
        for folder in personal_folders:
            print(f"  - {folder.name} (ID: {folder.id})")
    else:
        print("Creating personal folder for emponly...")
        # Create the personal folder
        from documents.models import Folder
        personal_folder = Folder.objects.create(
            name=personal_folder_name,
            owner=user,
            path=f"/{user.department} Documents/{personal_folder_name}" if user.department else f"/{personal_folder_name}",
            is_active=True
        )
        print(f"Created personal folder: {personal_folder.name} (ID: {personal_folder.id})")
        
except CustomUser.DoesNotExist:
    print("User 'emponly' not found")