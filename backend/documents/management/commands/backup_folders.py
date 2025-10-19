import os
import json
import django
from datetime import datetime

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.core.management.base import BaseCommand
from documents.models import Folder
from users.models import CustomUser

class Command(BaseCommand):
    help = 'Backup folder structure to JSON file'

    def add_arguments(self, parser):
        parser.add_argument(
            '--output',
            type=str,
            default='folder_backup.json',
            help='Output file path for backup (default: folder_backup.json)'
        )

    def handle(self, *args, **options):
        output_file = options['output']
        
        self.stdout.write(f'Backing up folder structure to {output_file}...')
        
        # Get all folders
        folders = Folder.objects.all()
        
        # Convert to serializable format
        folder_data = []
        for folder in folders:
            folder_data.append({
                'id': folder.id,
                'name': folder.name,
                'parent_folder_id': folder.parent_folder.id if folder.parent_folder else None,
                'owner_id': folder.owner.id,
                'owner_username': folder.owner.username,
                'owner_department': folder.owner.department,
                'created_at': folder.created_at.isoformat(),
                'updated_at': folder.updated_at.isoformat(),
                'is_active': folder.is_active,
                'path': folder.path
            })
        
        # Get all users for reference
        users = CustomUser.objects.all()
        user_data = []
        for user in users:
            user_data.append({
                'id': user.id,
                'username': user.username,
                'role': user.role,
                'department': user.department,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'is_active': user.is_active
            })
        
        # Create backup data
        backup_data = {
            'timestamp': datetime.now().isoformat(),
            'folders': folder_data,
            'users': user_data
        }
        
        # Write to file
        with open(output_file, 'w') as f:
            json.dump(backup_data, f, indent=2)
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully backed up {len(folder_data)} folders and {len(user_data)} users to {output_file}'
            )
        )