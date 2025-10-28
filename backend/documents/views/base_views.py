from rest_framework import viewsets, permissions
from django.db.models import Q
from ..models import Document, Tag, Correspondent, DocumentType, Folder
from ..serializers import DocumentSerializer, TagSerializer, CorrespondentSerializer, DocumentTypeSerializer, FolderSerializer
from ..search import DocumentSearchService
from ..health_check import SystemHealthCheckService
from ..validation.models import DocumentCreate, DocumentUpdate, TagCreate, TagUpdate
from ..validation.utils import validate_data, get_validation_error_response
from users.models import CustomUser

class DocumentBaseViewSet(viewsets.ModelViewSet):
    """
    Base ViewSet for document management with common functionality.
    
    This base class provides common functionality for document-related ViewSets,
    including querysets, permissions, and validation helpers.
    """
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
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