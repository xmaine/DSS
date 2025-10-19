from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q
from .models import Document, Tag, Correspondent, DocumentType, SharedItem, DocumentRating, Annotation, Folder
from users.models import CustomUser
from .serializers import DocumentSerializer, TagSerializer, CorrespondentSerializer, DocumentTypeSerializer, FolderSerializer, SharedItemSerializer
from .search import DocumentSearchService
from .health_check import SystemHealthCheckService
from .validation.models import DocumentCreate, DocumentUpdate, TagCreate, TagUpdate
from .validation.utils import validate_data, get_validation_error_response
import uuid

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    def get_queryset(self):
        """
        Filter documents based on user permissions:
        - Admin users can see all documents
        - Other users can see:
          1. Documents they own (uploaded)
          2. Documents explicitly shared with them
          3. Documents in folders belonging to their department (based on owner's department)
        """
        user = self.request.user
        
        # Admin users can see all documents
        if user.role == 'ADMIN':
            return Document.objects.all()
        
        # For other users, filter based on permissions
        # 1. Documents owned by the user (uploaded by them)
        owned_documents = Q(uploader=user)
        
        # 2. Documents explicitly shared with the user
        shared_documents = Q(shareditem__shared_with_user=user)
        
        # 3. Documents in folders belonging to the user's department
        #    (where the folder owner belongs to the same department as the current user)
        department_documents = Q(folder__owner__department=user.department) if user.department else Q()
        
        # Combine all conditions
        queryset = Document.objects.filter(
            owned_documents | shared_documents | department_documents
        ).distinct()
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        """
        Create a new document with Pydantic validation.
        """
        # Validate the input data
        validated_data = validate_data(DocumentCreate, request.data)
        if validated_data is None:
            return get_validation_error_response(DocumentCreate, request.data)
        
        # If validation passed, proceed with normal creation
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        """
        Update a document with Pydantic validation.
        """
        # Validate the input data
        validated_data = validate_data(DocumentUpdate, request.data)
        if validated_data is None:
            return get_validation_error_response(DocumentUpdate, request.data)
        
        # If validation passed, proceed with normal update
        return super().update(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search documents endpoint"""
        query = request.GET.get('q', '')
        filters = {}
        
        # Extract filters from request
        if 'tag' in request.GET:
            filters['tags'] = request.GET.getlist('tag')
        if 'correspondent' in request.GET:
            filters['correspondent'] = request.GET['correspondent']
        if 'document_type' in request.GET:
            filters['document_type'] = request.GET['document_type']
        
        search_service = DocumentSearchService()
        documents = search_service.search_documents(query, filters)
        
        serializer = self.get_serializer(documents, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def suggestions(self, request):
        """Get search suggestions"""
        query = request.GET.get('q', '')
        search_service = DocumentSearchService()
        suggestions = search_service.get_search_suggestions(query)
        return Response({'suggestions': suggestions})
    
    @action(detail=True, methods=['get'])
    def similar(self, request, pk=None):
        """Find similar documents"""
        search_service = DocumentSearchService()
        similar_documents = search_service.find_similar_documents(pk)
        
        serializer = self.get_serializer(similar_documents, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        """Create a shared link for a document"""
        try:
            document = Document.objects.get(id=pk)
            # Create a shared item
            shared_item = SharedItem.objects.create(
                document=document,
                shared_by=request.user if request.user.is_authenticated else None,
                shared_with_user=None,  # Would be set based on request data
                permission_codes=['view'],
                is_active=True
            )
            
            # For now, we'll return a simple response
            return Response({'message': 'Document shared successfully'}, status=status.HTTP_201_CREATED)
        except Document.DoesNotExist:
            return Response({'error': 'Document not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get dashboard data"""
        # Get recent documents
        recent_documents = Document.objects.order_by('-created_at')[:5]
        
        # Get document statistics
        total_documents = Document.objects.count()
        # processed_documents = Document.objects.filter(processed=True).count()
        # unprocessed_documents = Document.objects.filter(processed=False).count()
        
        # Get classification statistics
        tags_count = Tag.objects.count()
        correspondents_count = Correspondent.objects.count()
        document_types_count = DocumentType.objects.count()
        
        # Get system health
        health_service = SystemHealthCheckService()
        health_stats = health_service.get_system_statistics()
        
        data = {
            'recent_documents': DocumentSerializer(recent_documents, many=True).data,
            'statistics': {
                'total_documents': total_documents,
                # 'processed_documents': processed_documents,
                # 'unprocessed_documents': unprocessed_documents,
                'tags_count': tags_count,
                'correspondents_count': correspondents_count,
                'document_types_count': document_types_count
            },
            'health': health_stats
        }
        
        return Response(data)

    @action(detail=False, methods=['get'], url_path='admin-dashboard')
    def admin_dashboard(self, request):
        """Get System Administrator dashboard data with system health, activity feed, and statistics"""
        # System Health Status
        health_service = SystemHealthCheckService()
        health_stats = health_service.get_system_statistics()
        
        # Recent Activity Feed
        recent_activities = []
        # Get recent document uploads
        recent_docs = Document.objects.order_by('-created_at')[:5]
        for doc in recent_docs:
            recent_activities.append({
                'timestamp': doc.created_at,
                'user': doc.uploader.username if doc.uploader else 'Unknown',
                'action': 'uploaded document',
                'item': doc.name,
                'type': 'document'
            })
        
        # User Statistics
        total_users = CustomUser.objects.count()
        active_users = CustomUser.objects.filter(is_active=True).count()
        users_by_role = {
            'ADMIN': CustomUser.objects.filter(role='ADMIN').count(),
            'SENIOR_DEPT_HEAD': CustomUser.objects.filter(role='SENIOR_DEPT_HEAD').count(),
            'DEPT_HEAD': CustomUser.objects.filter(role='DEPT_HEAD').count(),
            'EMPLOYEE': CustomUser.objects.filter(role='EMPLOYEE').count(),
        }
        
        # Document Statistics
        total_documents = Document.objects.count()
        documents_by_type = {}
        for doc_type in DocumentType.objects.all():
            documents_by_type[doc_type.name] = Document.objects.filter(document_type=doc_type).count()
        
        # Storage consumed (simplified)
        total_storage = sum([doc.current_version.file_size for doc in Document.objects.all() if doc.current_version]) if Document.objects.exists() else 0
        
        # Pending Workflows summary
        pending_workflows = 0  # Placeholder for now
        
        data = {
            'system_health': health_stats,
            'recent_activity': recent_activities,
            'user_statistics': {
                'total_users': total_users,
                'active_users': active_users,
                'users_by_role': users_by_role
            },
            'document_statistics': {
                'total_documents': total_documents,
                'documents_by_type': documents_by_type,
                'storage_consumed': total_storage
            },
            'pending_workflows': pending_workflows,
            'quick_links': [
                {'name': 'Manage Users', 'url': '/api/users/'},
                {'name': 'View Logs', 'url': '/api/audit-logs/'}
            ]
        }
        
        return Response(data)

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        """
        Create a new tag with Pydantic validation.
        """
        # Validate the input data
        validated_data = validate_data(TagCreate, request.data)
        if validated_data is None:
            return get_validation_error_response(TagCreate, request.data)
        
        # If validation passed, proceed with normal creation
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        """
        Update a tag with Pydantic validation.
        """
        # Validate the input data
        validated_data = validate_data(TagUpdate, request.data)
        if validated_data is None:
            return get_validation_error_response(TagUpdate, request.data)
        
        # If validation passed, proceed with normal update
        return super().update(request, *args, **kwargs)

class CorrespondentViewSet(viewsets.ModelViewSet):
    queryset = Correspondent.objects.all()
    serializer_class = CorrespondentSerializer
    permission_classes = [permissions.AllowAny]

class DocumentTypeViewSet(viewsets.ModelViewSet):
    queryset = DocumentType.objects.all()
    serializer_class = DocumentTypeSerializer
    permission_classes = [permissions.AllowAny]

class FolderViewSet(viewsets.ModelViewSet):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
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
        """Share a folder with another user"""
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


class SharedItemViewSet(viewsets.ModelViewSet):
    queryset = SharedItem.objects.all()
    serializer_class = SharedItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def shared_with_me(self, request):
        """Get items shared with the current user"""
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
        """Get items shared by the current user"""
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