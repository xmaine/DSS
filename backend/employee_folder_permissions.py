import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from documents.models import Folder
from users.models import CustomUser
from django.db.models import Q

def test_employee_folder_creation_permissions():
    """Test that employees can create folders in their personal directory"""
    print("=== Testing Employee Folder Creation Permissions ===")
    
    # Get the employee user
    try:
        employee = CustomUser.objects.get(username='emponly')
        print(f"Testing for employee: {employee.username} ({employee.get_full_name()})")
        print(f"Department: {employee.department}")
        
        # Get employee's personal folder
        personal_folder = Folder.objects.get(name="emponly's Documents", owner=employee)
        print(f"Personal folder: {personal_folder.name}")
        print(f"Parent folder: {personal_folder.parent_folder.name if personal_folder.parent_folder else 'None'}")
        
        # Test folder creation permissions
        # In the current implementation, any authenticated user can create folders
        # The business logic for where they can create folders is handled in the frontend
        # and by the folder's parent_folder field
        
        print("\n=== Folder Creation Permissions ===")
        print("Employees can create subfolders in their personal directory:")
        print(f"  - Path: {personal_folder.path}")
        print("  - They can create folders under this path by setting parent_folder to their personal folder")
        
        # Show what folders the employee can access
        print("\n=== Accessible Folders for Employee ===")
        owned_folders = Q(owner=employee)
        shared_folders = Q(shareditem__shared_with_user=employee)
        department_folders = Q(owner__department=employee.department) if employee.department else Q()
        
        accessible_folders = Folder.objects.filter(
            owned_folders | shared_folders | department_folders
        ).distinct()
        
        for folder in accessible_folders:
            folder_type = ""
            if folder.owner == employee:
                folder_type = " (PERSONAL)"
            elif folder.owner.department == employee.department:
                folder_type = " (DEPARTMENT)"
            else:
                folder_type = " (SHARED)"
            print(f"  - {folder.name}{folder_type}")
            
    except CustomUser.DoesNotExist:
        print("Employee user not found")
    except Folder.DoesNotExist:
        print("Employee's personal folder not found")
    except Exception as e:
        print(f"Error testing permissions: {e}")

def demonstrate_folder_creation():
    """Demonstrate how an employee can create a new folder in their personal directory"""
    print("\n=== Demonstrating Folder Creation ===")
    
    try:
        employee = CustomUser.objects.get(username='emponly')
        personal_folder = Folder.objects.get(name="emponly's Documents", owner=employee)
        
        # Create a new subfolder
        new_folder_name = "Work Projects"
        new_folder_path = f"{personal_folder.path}/{new_folder_name}"
        
        # Check if folder already exists
        existing_folder = Folder.objects.filter(
            name=new_folder_name, 
            owner=employee, 
            parent_folder=personal_folder
        ).first()
        
        if existing_folder:
            print(f"Folder '{new_folder_name}' already exists in personal directory")
            new_folder = existing_folder
        else:
            # Create new folder
            new_folder = Folder.objects.create(
                name=new_folder_name,
                parent_folder=personal_folder,
                owner=employee,
                path=new_folder_path,
                is_active=True
            )
            print(f"Created new folder: {new_folder.name}")
            print(f"  - Path: {new_folder.path}")
            print(f"  - Parent: {new_folder.parent_folder.name}")
            
        # Show the folder hierarchy
        print("\n=== Folder Hierarchy ===")
        print(f"Publication Documents/")
        print(f"  └── emponly's Documents/")
        print(f"      └── {new_folder.name}/")
        
    except Exception as e:
        print(f"Error creating folder: {e}")

if __name__ == "__main__":
    test_employee_folder_creation_permissions()
    demonstrate_folder_creation()