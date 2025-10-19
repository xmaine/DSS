import os
import json
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.core.management.base import BaseCommand
from documents.models import Folder
from users.models import CustomUser

class Command(BaseCommand):
    help = 'Restore folder structure from JSON backup file'

    def add_arguments(self, parser):
        parser.add_argument(
            'input_file',
            type=str,
            help='Input file path for backup restoration'
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force restoration even if folders already exist'
        )

    def handle(self, *args, **options):
        input_file = options['input_file']
        force = options['force']
        
        self.stdout.write(f'Restoring folder structure from {input_file}...')
        
        # Read backup data
        try:
            with open(input_file, 'r') as f:
                backup_data = json.load(f)
        except FileNotFoundError:
            self.stdout.write(
                self.style.ERROR(f'Backup file {input_file} not found')
            )
            return
        except json.JSONDecodeError:
            self.stdout.write(
                self.style.ERROR(f'Invalid JSON in backup file {input_file}')
            )
            return
        
        # Get existing folders for reference
        existing_folders = {folder.id: folder for folder in Folder.objects.all()}
        
        # Restore users (update existing ones)
        restored_users = {}
        for user_data in backup_data.get('users', []):
            try:
                user, created = CustomUser.objects.update_or_create(
                    id=user_data['id'],
                    defaults={
                        'username': user_data['username'],
                        'role': user_data['role'],
                        'department': user_data['department'],
                        'first_name': user_data['first_name'],
                        'last_name': user_data['last_name'],
                        'email': user_data['email'],
                        'is_active': user_data['is_active']
                    }
                )
                restored_users[user_data['id']] = user
                if created:
                    self.stdout.write(f'Created user: {user.username}')
                else:
                    self.stdout.write(f'Updated user: {user.username}')
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error restoring user {user_data["username"]}: {e}')
                )
        
        # Restore folders
        folder_mapping = {}  # Map old IDs to new objects
        folder_data_list = backup_data.get('folders', [])
        
        # First pass: Create folders without parent relationships
        for folder_data in folder_data_list:
            try:
                # Check if folder already exists
                existing_folder = Folder.objects.filter(
                    name=folder_data['name'],
                    owner_id=folder_data['owner_id']
                ).first()
                
                if existing_folder and not force:
                    self.stdout.write(
                        f'Folder {folder_data["name"]} already exists, skipping...'
                    )
                    folder_mapping[folder_data['id']] = existing_folder
                    continue
                
                # Get owner user
                owner = restored_users.get(folder_data['owner_id'])
                if not owner:
                    self.stdout.write(
                        self.style.WARNING(
                            f'Owner not found for folder {folder_data["name"]}, skipping...'
                        )
                    )
                    continue
                
                # Create or update folder
                folder_defaults = {
                    'name': folder_data['name'],
                    'owner': owner,
                    'is_active': folder_data['is_active'],
                    'path': folder_data['path']
                }
                
                folder, created = Folder.objects.update_or_create(
                    id=folder_data['id'],
                    defaults=folder_defaults
                )
                
                folder_mapping[folder_data['id']] = folder
                
                if created:
                    self.stdout.write(f'Created folder: {folder.name}')
                else:
                    self.stdout.write(f'Updated folder: {folder.name}')
                    
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error restoring folder {folder_data["name"]}: {e}')
                )
        
        # Second pass: Update parent folder relationships
        for folder_data in folder_data_list:
            try:
                folder = folder_mapping.get(folder_data['id'])
                if not folder:
                    continue
                
                # Update parent folder if it exists in the mapping
                parent_id = folder_data['parent_folder_id']
                if parent_id and parent_id in folder_mapping:
                    folder.parent_folder = folder_mapping[parent_id]
                    folder.save()
                    self.stdout.write(
                        f'Updated parent folder for {folder.name}'
                    )
                    
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(
                        f'Error updating parent folder for {folder_data["name"]}: {e}'
                    )
                )
        
        self.stdout.write(
            self.style.SUCCESS('Folder restoration completed')
        )