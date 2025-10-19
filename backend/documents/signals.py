from django.db.models.signals import post_save
from django.dispatch import receiver
from users.models import CustomUser
from .models import Folder

@receiver(post_save, sender=CustomUser)
def create_employee_personal_folder(sender, instance, created, **kwargs):
    """
    Automatically create a personal folder for new employees.
    """
    if created and instance.role == 'EMPLOYEE':
        folder_name = f"{instance.username}'s Documents"
        
        # Check if folder already exists (shouldn't happen with created=True, but just in case)
        folder_exists = Folder.objects.filter(name=folder_name, owner=instance).exists()
        
        if not folder_exists:
            # Create the personal folder
            personal_folder = Folder.objects.create(
                name=folder_name,
                owner=instance,
                path=f"/{instance.department}/{folder_name}" if instance.department else f"/{folder_name}",
                is_active=True
            )
            print(f"Created personal folder for new employee {instance.username}: {folder_name}")