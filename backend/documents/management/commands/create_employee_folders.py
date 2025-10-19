import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.core.management.base import BaseCommand
from users.models import CustomUser
from documents.models import Folder

class Command(BaseCommand):
    help = 'Create personal folders for all employees'

    def handle(self, *args, **options):
        self.stdout.write('Creating personal folders for employees...')
        
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
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Created personal folder for {employee.username}: {folder_name}'
                    )
                )
            else:
                self.stdout.write(
                    f'Personal folder already exists for {employee.username}: {folder_name}'
                )
        
        self.stdout.write(
            self.style.SUCCESS('Finished creating personal folders for employees')
        )