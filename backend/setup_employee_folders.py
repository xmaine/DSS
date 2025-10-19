import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import CustomUser
from documents.models import Folder

def create_employee_folders():
    """Create personal folders for all employees in their respective departments"""
    print("Creating personal folders for employees...")
    
    # Get all employees
    employees = CustomUser.objects.filter(role='EMPLOYEE')
    
    for employee in employees:
        # Create a personal folder for each employee
        folder_name = f"{employee.username}'s Documents"
        
        # Check if folder already exists
        folder_exists = Folder.objects.filter(name=folder_name, owner=employee).exists()
        
        if not folder_exists:
            # Create the personal folder
            personal_folder = Folder.objects.create(
                name=folder_name,
                owner=employee,
                path=f"/{employee.department}/{folder_name}" if employee.department else f"/{folder_name}",
                is_active=True
            )
            print(f"  - Created personal folder for {employee.username}: {folder_name}")
        else:
            print(f"  - Personal folder already exists for {employee.username}: {folder_name}")

def verify_employee_access():
    """Verify that employees can only access appropriate folders"""
    from django.db.models import Q
    
    print("\n=== Verifying Employee Folder Access ===")
    
    employees = CustomUser.objects.filter(role='EMPLOYEE')
    
    for employee in employees:
        print(f"\n{employee.username} ({employee.role}) in {employee.department} department:")
        
        # Apply the same logic as in FolderViewSet.get_queryset()
        owned_folders = Q(owner=employee)
        shared_folders = Q(shareditem__shared_with_user=employee)
        department_folders = Q(owner__department=employee.department) if employee.department else Q()
        
        accessible_folders = Folder.objects.filter(
            owned_folders | shared_folders | department_folders
        ).distinct()
        
        for folder in accessible_folders:
            if folder.owner == employee:
                print(f"  - {folder.name} (PERSONAL FOLDER)")
            elif folder.owner.department == employee.department:
                print(f"  - {folder.name} (Department folder owned by {folder.owner.username})")
            else:
                print(f"  - {folder.name} (Shared with user)")

if __name__ == "__main__":
    create_employee_folders()
    verify_employee_access()