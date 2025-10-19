import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import CustomUser
from documents.models import Folder

def test_employee_folder_creation():
    print("=== Testing Employee Folder Creation ===")
    
    # Check if emponly user exists
    try:
        employee = CustomUser.objects.get(username='emponly')
        print(f"Employee found: {employee.username} ({employee.role}) in {employee.department}")
        
        # Check if personal folder exists
        folder_name = f"{employee.username}'s Documents"
        personal_folder = Folder.objects.filter(name=folder_name, owner=employee)
        
        if personal_folder.exists():
            folder = personal_folder.first()
            print(f"Personal folder found: {folder.name}")
            print(f"  - ID: {folder.id}")
            print(f"  - Path: {folder.path}")
            print(f"  - Owner: {folder.owner.username}")
        else:
            print("No personal folder found for employee")
            
    except CustomUser.DoesNotExist:
        print("Employee 'emponly' not found")

if __name__ == "__main__":
    test_employee_folder_creation()