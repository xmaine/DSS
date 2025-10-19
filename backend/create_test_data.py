import os
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from documents.models import SharedItem, Document
from users.models import CustomUser

def create_test_shared_items():
    try:
        # Get users
        user1 = CustomUser.objects.get(username='emponly')
        user2 = CustomUser.objects.get(username='sysadmins')
        
        # Get a document
        doc = Document.objects.first()
        
        if doc:
            # Create shared item
            shared_item = SharedItem.objects.create(
                document=doc,
                shared_by=user1,
                shared_with_user=user2,
                permission_codes=['view'],
                is_active=True
            )
            print(f'Created shared item: {shared_item}')
        else:
            print('No documents found')
            
        # Also create a shared folder if there are folders
        from documents.models import Folder
        folder = Folder.objects.first()
        if folder:
            shared_folder = SharedItem.objects.create(
                folder=folder,
                shared_by=user2,
                shared_with_user=user1,
                permission_codes=['view', 'change'],
                is_active=True
            )
            print(f'Created shared folder: {shared_folder}')
            
    except Exception as e:
        print(f'Error: {e}')

if __name__ == '__main__':
    create_test_shared_items()