from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q
from .base_views import DocumentBaseViewSet
from ..models import Document, Tag, Correspondent, DocumentType, SharedItem, DocumentRating, Annotation, Folder, DocumentVersion
from users.models import CustomUser
from ..serializers import DocumentSerializer, TagSerializer, CorrespondentSerializer, DocumentTypeSerializer, FolderSerializer, SharedItemSerializer
from ..search import DocumentSearchService
from ..health_check import SystemHealthCheckService
from ..validation.models import DocumentCreate, DocumentUpdate, TagCreate, TagUpdate
from ..validation.utils import validate_data, get_validation_error_response
import uuid

class DocumentViewSet(DocumentBaseViewSet):
    """
    ViewSet for managing documents in the system.
    
    This ViewSet provides CRUD operations for documents, along with additional
    actions for searching, sharing, and dashboard functionality.
    """
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    def create(self, request, *args, **kwargs):
        """
        Create a new document with Pydantic validation.
        
        Args:
            request: The HTTP request containing document data.
            *args: Additional positional arguments.
            **kwargs: Additional keyword arguments.
            
        Returns:
            Response: A JSON response with the created document or validation errors.
        """
        # Check if this is a file upload (multipart data)
        if request.content_type.startswith('multipart'):
            # Handle file upload without Pydantic validation for multipart requests
            # For multipart requests, the file is in request.FILES, not request.data
            # We need to process the data differently
            
            # Extract data from request
            title = request.data.get('title', 'Untitled')
            description = request.data.get('description', '')
            folder_id = request.data.get('folder')
            uploader_id = request.data.get('uploader')
            original_filename = request.data.get('original_filename', '')
            file_size = request.data.get('file_size', 0)
            mime_type = request.data.get('mime_type', '')
            
            # Get the file from request.FILES
            uploaded_file = request.FILES.get('file')
            
            if not uploaded_file:
                return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Get the uploader user
            try:
                uploader = CustomUser.objects.get(id=uploader_id) if uploader_id else request.user
            except CustomUser.DoesNotExist:
                return Response({'error': 'Invalid uploader'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Get the folder if provided
            folder = None
            if folder_id:
                try:
                    folder = Folder.objects.get(id=folder_id)
                except Folder.DoesNotExist:
                    # If folder doesn't exist, we'll create the document without a folder
                    pass
            
            # Create the document
            document = Document.objects.create(
                title=title,
                description=description,
                folder=folder,
                uploader=uploader,
                is_active=True
            )
            
            # Create the document version
            document_version = DocumentVersion.objects.create(
                document=document,
                version_number=1.0,
                file=uploaded_file,
                file_size=file_size or uploaded_file.size,
                file_type=mime_type or uploaded_file.content_type,
                uploaded_by=uploader,
                is_current=True
            )
            
            # Update the document with the current version
            document.current_version = document_version
            document.save()
            
            # Serialize and return the response
            serializer = self.get_serializer(document)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Validate the input data for regular JSON requests
            validated_data = validate_data(DocumentCreate, request.data)
            if validated_data is None:
                return get_validation_error_response(DocumentCreate, request.data)
            
            # If validation passed, proceed with normal creation
            return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        """
        Update a document with Pydantic validation.
        
        Args:
            request: The HTTP request containing updated document data.
            *args: Additional positional arguments.
            **kwargs: Additional keyword arguments.
            
        Returns:
            Response: A JSON response with the updated document or validation errors.
        """
        # Validate the input data
        validated_data = validate_data(DocumentUpdate, request.data)
        if validated_data is None:
            return get_validation_error_response(DocumentUpdate, request.data)
        
        # If validation passed, proceed with normal update
        return super().update(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        Search documents endpoint.
        
        Allows searching documents by query text and filtering by tags, correspondent,
        and document type.
        
        Args:
            request: The HTTP request containing search parameters.
            
        Returns:
            Response: A JSON response with matching documents.
        """
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
        """
        Get search suggestions based on partial query text.
        
        Args:
            request: The HTTP request containing the partial query.
            
        Returns:
            Response: A JSON response with search suggestions.
        """
        query = request.GET.get('q', '')
        search_service = DocumentSearchService()
        suggestions = search_service.get_search_suggestions(query)
        return Response({'suggestions': suggestions})
    
    @action(detail=True, methods=['get'])
    def similar(self, request, pk=None):
        """
        Find documents similar to the specified document.
        
        Args:
            request: The HTTP request.
            pk: The primary key of the document to find similarities for.
            
        Returns:
            Response: A JSON response with similar documents.
        """
        search_service = DocumentSearchService()
        similar_documents = search_service.find_similar_documents(pk)
        
        serializer = self.get_serializer(similar_documents, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        """
        Create a shared link for a document.
        
        Args:
            request: The HTTP request.
            pk: The primary key of the document to share.
            
        Returns:
            Response: A JSON response indicating success or failure.
        """
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
        """
        Get dashboard data for the current user.
        
        Returns statistics, recent documents, and system health information.
        
        Args:
            request: The HTTP request.
            
        Returns:
            Response: A JSON response with dashboard data.
        """
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
        """
        Get System Administrator dashboard data with system health, activity feed, and statistics.
        
        Args:
            request: The HTTP request.
            
        Returns:
            Response: A JSON response with admin dashboard data.
        """
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