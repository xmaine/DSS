import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import CustomUser
from documents.models import Folder
from django.db.models import Q

def test_user_access(username):
    """Test folder access for a specific user"""
    try:
        user = CustomUser.objects.get(username=username)
        print(f"\n=== Testing access for {user.username} ({user.role}) in {user.department} department ===")
        
        # Apply the same logic as in FolderViewSet.get_queryset()
        if user.role == 'ADMIN':
            # Admin users can see all folders
            accessible_folders = Folder.objects.all()
            print("ADMIN user - can see all folders:")
        else:
            # For other users, filter based on permissions
            owned_folders = Q(owner=user)
            shared_folders = Q(shareditem__shared_with_user=user)
            department_folders = Q(owner__department=user.department) if user.department else Q()
            
            accessible_folders = Folder.objects.filter(
                owned_folders | shared_folders | department_folders
            ).distinct()
            print(f"Accessible folders:")
        
        for folder in accessible_folders:
            print(f"  - {folder.name} (owned by {folder.owner.username} from {folder.owner.department} dept)")
            
        print(f"Total accessible folders: {accessible_folders.count()}")
        
    except CustomUser.DoesNotExist:
        print(f"User {username} not found")

if __name__ == "__main__":
    # Test all users
    usernames = ['emponly', 'sysadmins', 'seniordepthd', 'depthd']
    
    for username in usernames:
        test_user_access(username)