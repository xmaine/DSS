from rest_framework import viewsets, permissions
from .base_views import DocumentBaseViewSet
from ..models import Tag, Correspondent, DocumentType
from ..serializers import TagSerializer, CorrespondentSerializer, DocumentTypeSerializer
from ..validation.models import TagCreate, TagUpdate
from ..validation.utils import validate_data, get_validation_error_response

class TagViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing document tags.
    
    Provides CRUD operations for tags with validation.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        """
        Create a new tag with Pydantic validation.
        
        Args:
            request: The HTTP request containing tag data.
            *args: Additional positional arguments.
            **kwargs: Additional keyword arguments.
            
        Returns:
            Response: A JSON response with the created tag or validation errors.
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
        
        Args:
            request: The HTTP request containing updated tag data.
            *args: Additional positional arguments.
            **kwargs: Additional keyword arguments.
            
        Returns:
            Response: A JSON response with the updated tag or validation errors.
        """
        # Validate the input data
        validated_data = validate_data(TagUpdate, request.data)
        if validated_data is None:
            return get_validation_error_response(TagUpdate, request.data)
        
        # If validation passed, proceed with normal update
        return super().update(request, *args, **kwargs)

class CorrespondentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing document correspondents.
    
    Provides CRUD operations for correspondents.
    """
    queryset = Correspondent.objects.all()
    serializer_class = CorrespondentSerializer
    permission_classes = [permissions.AllowAny]

class DocumentTypeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing document types.
    
    Provides CRUD operations for document types.
    """
    queryset = DocumentType.objects.all()
    serializer_class = DocumentTypeSerializer
    permission_classes = [permissions.AllowAny]