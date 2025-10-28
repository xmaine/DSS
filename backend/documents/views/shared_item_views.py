from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .base_views import DocumentBaseViewSet
from ..models import SharedItem, Document, Folder
from users.models import CustomUser
from ..serializers import SharedItemSerializer

class SharedItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing shared items (documents/folders shared between users).
    
    This ViewSet provides actions for:
    - Listing items shared with the current user
    - Listing items shared by the current user
    - Managing shared item records
    """
    queryset = SharedItem.objects.all()
    serializer_class = SharedItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def shared_with_me(self, request):
        """
        Get items shared with the current user.
        
        Returns a list of documents and folders that have been shared with the 
        current user, including sharing details like permissions and sharer info.
        
        Args:
            request: The HTTP request object.
            
        Returns:
            Response: A JSON response containing the shared items.
        """
        # Filter shared items where the current user is the recipient and the share is active
        shared_items = SharedItem.objects.filter(
            shared_with_user=request.user,
            is_active=True
        ).select_related('document', 'folder', 'shared_by')
        
        # Process the shared items to return a consistent format
        result = []
        for item in shared_items:
            if item.document:
                result.append({
                    'id': item.id,
                    'type': 'document',
                    'name': item.document.name,
                    'shared_by': item.shared_by.username if item.shared_by else 'Unknown',
                    'permission_codes': item.permission_codes if item.permission_codes else ['view'],
                    'permission_level': ', '.join(item.permission_codes) if item.permission_codes else 'VIEW',
                    'created_at': item.created_at,
                    'item_id': item.document.id
                })
            elif item.folder:
                result.append({
                    'id': item.id,
                    'type': 'folder',
                    'name': item.folder.name,
                    'shared_by': item.shared_by.username if item.shared_by else 'Unknown',
                    'permission_codes': item.permission_codes if item.permission_codes else ['view'],
                    'permission_level': ', '.join(item.permission_codes) if item.permission_codes else 'VIEW',
                    'created_at': item.created_at,
                    'item_id': item.folder.id
                })
        
        return Response(result)
    
    @action(detail=False, methods=['get'])
    def shared_by_me(self, request):
        """
        Get items shared by the current user.
        
        Returns a list of documents and folders that the current user has shared
        with others, including details about the recipients and permissions.
        
        Args:
            request: The HTTP request object.
            
        Returns:
            Response: A JSON response containing the shared items.
        """
        # Filter shared items where the current user is the sharer and the share is active
        shared_items = SharedItem.objects.filter(
            shared_by=request.user,
            is_active=True
        ).select_related('document', 'folder', 'shared_with_user')
        
        # Process the shared items to return a consistent format
        result = []
        for item in shared_items:
            if item.document:
                result.append({
                    'id': item.id,
                    'type': 'document',
                    'name': item.document.name,
                    'shared_with': item.shared_with_user.username if item.shared_with_user else 'Group',
                    'permission_codes': item.permission_codes if item.permission_codes else ['view'],
                    'permission_level': ', '.join(item.permission_codes) if item.permission_codes else 'VIEW',
                    'created_at': item.created_at,
                    'item_id': item.document.id
                })
            elif item.folder:
                result.append({
                    'id': item.id,
                    'type': 'folder',
                    'name': item.folder.name,
                    'shared_with': item.shared_with_user.username if item.shared_with_user else 'Group',
                    'permission_codes': item.permission_codes if item.permission_codes else ['view'],
                    'permission_level': ', '.join(item.permission_codes) if item.permission_codes else 'VIEW',
                    'created_at': item.created_at,
                    'item_id': item.folder.id
                })
        
        return Response(result)