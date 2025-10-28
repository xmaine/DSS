from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .base_views import DocumentBaseViewSet
from ..models import Folder, SharedItem
from users.models import CustomUser
from ..serializers import FolderSerializer

class FolderViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing folders in the document hierarchy.
    
    Provides CRUD operations for folders and additional actions for sharing.
    """
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        """
        Create a new folder.
        
        Args:
            request: The HTTP request containing folder data.
            *args: Additional positional arguments.
            **kwargs: Additional keyword arguments.
            
        Returns:
            Response: A JSON response with the created folder.
        """
        return super().create(request, *args, **kwargs)
        
    def perform_create(self, serializer):
        """
        Perform the actual folder creation with proper path handling.
        
        Args:
            serializer: The serializer with the folder data.
        """
        # Get the validated data
        data = serializer.validated_data
        
        # Ensure the owner is set to the current user if not provided
        if 'owner' not in data or not data['owner']:
            data['owner'] = self.request.user
            
        # Ensure path is properly set if not provided
        if 'path' not in data or not data['path']:
            # Try to build path from parent folder if provided
            parent_folder = data.get('parent_folder')
            folder_name = data.get('name', 'Untitled')
            if parent_folder:
                data['path'] = f"{parent_folder.path}/{folder_name}"
            else:
                # For employees, create path based on their username
                # This ensures employees can create folders in their personal space
                if self.request.user.role == 'EMPLOYEE':
                    data['path'] = f"/{self.request.user.username}/{folder_name}"
                else:
                    # Default path if no parent for non-employees
                    data['path'] = f"/{folder_name}"
                
        # Save the folder
        serializer.save()
    
    def get_queryset(self):
        """
        Filter folders based on user permissions:
        - Admin users can see all folders
        - Other users can see:
          1. Folders they own
          2. Folders explicitly shared with them
          3. Folders belonging to their department (based on owner's department)
        """
        user = self.request.user
        
        # Admin users can see all folders
        if user.role == 'ADMIN':
            return Folder.objects.all()
        
        # For other users, filter based on permissions
        # 1. Folders owned by the user
        owned_folders = Q(owner=user)
        
        # 2. Folders explicitly shared with the user
        shared_folders = Q(shareditem__shared_with_user=user)
        
        # 3. Folders belonging to the user's department
        #    (where the folder owner belongs to the same department as the current user)
        department_folders = Q(owner__department=user.department) if user.department else Q()
        
        # Combine all conditions
        queryset = Folder.objects.filter(
            owned_folders | shared_folders | department_folders
        ).distinct()
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        """
        Share a folder with another user.
        
        Args:
            request: The HTTP request containing sharing parameters.
            pk: The primary key of the folder to share.
            
        Returns:
            Response: A JSON response indicating success or failure.
        """
        try:
            folder = self.get_object()
            
            # Check if the current user owns the folder
            if folder.owner != request.user:
                return Response(
                    {'error': 'You do not have permission to share this folder'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Get sharing parameters from request data
            shared_with_user_id = request.data.get('shared_with_user')
            permission_codes = request.data.get('permission_codes', ['view'])
            
            if not shared_with_user_id:
                return Response(
                    {'error': 'shared_with_user is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get the user to share with
            try:
                shared_with_user = CustomUser.objects.get(id=shared_with_user_id)
            except CustomUser.DoesNotExist:
                return Response(
                    {'error': 'User not found'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Create or update the shared item
            shared_item, created = SharedItem.objects.get_or_create(
                folder=folder,
                shared_by=request.user,
                shared_with_user=shared_with_user,
                defaults={
                    'permission_codes': permission_codes,
                    'is_active': True
                }
            )
            
            if not created:
                # Update existing share
                shared_item.permission_codes = permission_codes
                shared_item.is_active = True
                shared_item.save()
            
            # Return success response
            return Response({
                'message': f'Folder shared successfully with {shared_with_user.username}',
                'shared_item_id': shared_item.id
            }, status=status.HTTP_201_CREATED)
            
        except Folder.DoesNotExist:
            return Response({'error': 'Folder not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)