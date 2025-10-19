import os
import django
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.test import RequestFactory
from documents.views import FolderViewSet
from users.models import CustomUser
from django.contrib.auth.models import AnonymousUser

def test_folder_api():
    print("=== Testing Folder API ===")
    
    # Create a request factory
    factory = RequestFactory()
    
    # Get the emponly user
    try:
        user = CustomUser.objects.get(username='emponly')
        print(f"Testing for user: {user.username} ({user.role}) in {user.department}")
        
        # Create a mock request
        request = factory.get('/api/folders/')
        request.user = user
        
        # Create the viewset
        viewset = FolderViewSet()
        viewset.request = request
        viewset.format_kwarg = {}
        
        # Get the queryset
        queryset = viewset.get_queryset()
        print(f"Number of folders accessible to user: {queryset.count()}")
        
        # Print folder details
        for folder in queryset:
            folder_type = ""
            if folder.owner == user:
                folder_type = " (PERSONAL FOLDER)"
            elif folder.owner.department == user.department:
                folder_type = " (Department folder)"
            else:
                folder_type = " (Shared with user)"
            print(f"  - {folder.name} (ID: {folder.id}){folder_type}")
            
        # Serialize the data
        from documents.serializers import FolderSerializer
        serializer = FolderSerializer(queryset, many=True)
        print(f"\nSerialized data: {json.dumps(serializer.data, indent=2, default=str)}")
        
    except CustomUser.DoesNotExist:
        print("Employee 'emponly' not found")

if __name__ == "__main__":
    test_folder_api()