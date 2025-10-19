import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.core.management.base import BaseCommand
from documents.models import Folder
from users.models import CustomUser

class Command(BaseCommand):
    help = 'Check folder structure and verify employee folders'

    def handle(self, *args, **options):
        self.stdout.write('=== Folders ===')
        for folder in Folder.objects.all():
            self.stdout.write(f'{folder.name} (ID: {folder.id}) - Owner: {folder.owner.username} (Dept: {folder.owner.department})')

        self.stdout.write('\n=== Users ===')
        for user in CustomUser.objects.all():
            self.stdout.write(f'{user.username} ({user.role}) - Dept: {user.department}')

        self.stdout.write('\n=== Employee Folder Access Check ===')
        try:
            emp = CustomUser.objects.get(username="emponly")
            self.stdout.write(f'Employee {emp.username} is in department: {emp.department}')
            
            # Check if employee has a personal folder
            personal_folder = Folder.objects.filter(name=f"{emp.username}'s Documents", owner=emp)
            if personal_folder.exists():
                self.stdout.write(self.style.SUCCESS(f'✓ Personal folder found: {personal_folder.first().name}'))
            else:
                self.stdout.write(self.style.ERROR('✗ No personal folder found for employee'))
                
            # Check accessible folders
            accessible_folders = Folder.objects.filter(owner__department=emp.department)
            self.stdout.write(f'Folders accessible to {emp.username}:')
            for folder in accessible_folders:
                folder_type = ""
                if folder.owner == emp:
                    folder_type = " (PERSONAL FOLDER)"
                elif folder.owner.department == emp.department:
                    folder_type = " (Department folder)"
                else:
                    folder_type = " (Shared with user)"
                self.stdout.write(f'  - {folder.name}{folder_type}')
                
        except CustomUser.DoesNotExist:
            self.stdout.write('Employee "emponly" not found')