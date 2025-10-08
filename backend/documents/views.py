from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Document, Tag, Correspondent, DocumentType, DocumentPermission, SharedLink
from .serializers import DocumentSerializer, TagSerializer, CorrespondentSerializer, DocumentTypeSerializer, DocumentPermissionSerializer, SharedLinkSerializer
from .search import DocumentSearchService
from .health_check import SystemHealthCheckService
from .validation.models import DocumentCreate, DocumentUpdate, TagCreate, TagUpdate
from .validation.utils import validate_data, get_validation_error_response
import uuid

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = (MultiPartParser, FormParser)
    
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
            # Create a shared link
            shared_link = SharedLink.objects.create(
                document=document,
                token=str(uuid.uuid4()),
                created_by=request.user if request.user.is_authenticated else None,
                is_active=True
            )
            
            serializer = SharedLinkSerializer(shared_link)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Document.DoesNotExist:
            return Response({'error': 'Document not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get dashboard data"""
        # Get recent documents
        recent_documents = Document.objects.order_by('-uploaded_at')[:5]
        
        # Get document statistics
        total_documents = Document.objects.count()
        processed_documents = Document.objects.filter(processed=True).count()
        unprocessed_documents = Document.objects.filter(processed=False).count()
        
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
                'processed_documents': processed_documents,
                'unprocessed_documents': unprocessed_documents,
                'tags_count': tags_count,
                'correspondents_count': correspondents_count,
                'document_types_count': document_types_count
            },
            'health': health_stats
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

class DocumentPermissionViewSet(viewsets.ModelViewSet):
    queryset = DocumentPermission.objects.all()
    serializer_class = DocumentPermissionSerializer
    permission_classes = [permissions.AllowAny]

class SharedLinkViewSet(viewsets.ModelViewSet):
    queryset = SharedLink.objects.all()
    serializer_class = SharedLinkSerializer
    permission_classes = [permissions.AllowAny]