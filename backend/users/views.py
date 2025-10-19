from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import CustomUser, Department
from .serializers import CustomUserSerializer, DepartmentSerializer
from documents.models import Document, DocumentType, Correspondent, Tag, Folder, AuditLog
from processing.models import WorkflowTemplate, WorkflowStep
from documents.serializers import DocumentSerializer, DocumentTypeSerializer, CorrespondentSerializer, TagSerializer, FolderSerializer, AuditLogSerializer
from processing.serializers import WorkflowTemplateSerializer

class AuthViewSet(viewsets.ViewSet):
    """
    ViewSet for authentication endpoints
    """
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['post'], url_path='login')
    def login_user(self, request):
        """Authenticate and login a user"""
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            serializer = CustomUserSerializer(user)
            return Response({
                'success': True,
                'user': serializer.data
            })
        else:
            return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
    
    @action(detail=False, methods=['post'], url_path='logout')
    def logout_user(self, request):
        """Logout the current user"""
        logout(request)
        return Response({'message': 'Successfully logged out'})
    
    @action(detail=False, methods=['get'], url_path='me')
    def get_current_user(self, request):
        """Get the current authenticated user"""
        if request.user.is_authenticated:
            serializer = CustomUserSerializer(request.user)
            return Response({'data': serializer.data})
        else:
            return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

class AdminDashboardViewSet(viewsets.ViewSet):
    """
    ViewSet for System Administrator Dashboard and management functions
    """
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get System Administrator dashboard data"""
        # Check if user is admin
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
        
        # System Health Status
        # Placeholder for actual health check
        system_health = {
            'database_status': 'OK',
            'storage_usage': '35%',
            'active_connections': 12
        }
        
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
            'system_health': system_health,
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
                {'name': 'Manage Users', 'url': '/api/admin/users/'},
                {'name': 'View Logs', 'url': '/api/admin/audit-logs/'}
            ]
        }
        
        return Response(data)

class UserManagementViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing users
    """
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Only admins can access this
        if self.request.user.role != 'ADMIN':
            return CustomUser.objects.none()
        return super().get_queryset()
    
    @action(detail=False, methods=['get'], url_path='search')
    def search(self, request):
        """Search users by various criteria"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        query = request.GET.get('q', '')
        role = request.GET.get('role', '')
        department = request.GET.get('department', '')
        
        users = CustomUser.objects.all()
        
        if query:
            users = users.filter(username__icontains=query) | users.filter(first_name__icontains=query) | users.filter(last_name__icontains=query) | users.filter(email__icontains=query)
        
        if role:
            users = users.filter(role=role)
            
        if department:
            users = users.filter(department__icontains=department)
            
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], url_path='activate')
    def activate_user(self, request, pk=None):
        """Activate a user"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        try:
            user = CustomUser.objects.get(id=pk)
            user.is_active = True
            user.save()
            return Response({'message': 'User activated successfully'})
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['post'], url_path='deactivate')
    def deactivate_user(self, request, pk=None):
        """Deactivate a user"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        try:
            user = CustomUser.objects.get(id=pk)
            user.is_active = False
            user.save()
            return Response({'message': 'User deactivated successfully'})
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def create(self, request, *args, **kwargs):
        """Create a new user based on role hierarchy rules"""
        # Check if user has permission to create users
        if request.user.role == 'EMPLOYEE':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
        
        # Get the role being assigned to the new user
        new_user_role = request.data.get('role', 'EMPLOYEE')
        
        # Validate role creation permissions based on hierarchy
        if request.user.role == 'ADMIN':
            # System Administrator can create any user role
            pass
        elif request.user.role == 'SENIOR_DEPT_HEAD':
            # Senior Department Head can create Department Head and Employee
            if new_user_role not in ['DEPT_HEAD', 'EMPLOYEE']:
                return Response({'error': 'Access denied: Cannot create user with this role'}, status=status.HTTP_403_FORBIDDEN)
            # Check if the new user is being assigned to a department within the Sr. Dept Head's scope
            new_user_dept = request.data.get('department', '')
            if new_user_dept and request.user.department and not new_user_dept.startswith(request.user.department):
                return Response({'error': 'Access denied: Cannot assign user to department outside your scope'}, status=status.HTTP_403_FORBIDDEN)
        elif request.user.role == 'DEPT_HEAD':
            # Department Head can only create Employee
            if new_user_role != 'EMPLOYEE':
                return Response({'error': 'Access denied: Cannot create user with this role'}, status=status.HTTP_403_FORBIDDEN)
            # Check if the new user is being assigned to the Dept Head's department
            new_user_dept = request.data.get('department', '')
            if new_user_dept and request.user.department and new_user_dept != request.user.department:
                return Response({'error': 'Access denied: Cannot assign user to department outside your scope'}, status=status.HTTP_403_FORBIDDEN)
        
        # Get password from request data
        password = request.data.get('password')
        if not password:
            return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create user
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Set password
            user.set_password(password)
            user.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        """Update a user with role and department validation"""
        # Get the user being updated
        instance = self.get_object()
        
        # Check if user has permission to update this user
        if request.user.role == 'EMPLOYEE':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
        
        # Validate role update permissions based on hierarchy
        if request.user.role == 'ADMIN':
            # System Administrator can update any user
            pass
        elif request.user.role == 'SENIOR_DEPT_HEAD':
            # Senior Department Head can only update users in their department
            if instance.department != request.user.department:
                return Response({'error': 'Access denied: Cannot update user outside your department'}, status=status.HTTP_403_FORBIDDEN)
            # Senior Department Head cannot promote users to ADMIN or SENIOR_DEPT_HEAD
            new_role = request.data.get('role', instance.role)
            if new_role in ['ADMIN', 'SENIOR_DEPT_HEAD'] and new_role != instance.role:
                return Response({'error': 'Access denied: Cannot promote user to this role'}, status=status.HTTP_403_FORBIDDEN)
        elif request.user.role == 'DEPT_HEAD':
            # Department Head can only update employees in their department
            if instance.department != request.user.department:
                return Response({'error': 'Access denied: Cannot update user outside your department'}, status=status.HTTP_403_FORBIDDEN)
            # Department Head cannot change roles
            new_role = request.data.get('role', instance.role)
            if new_role != instance.role:
                return Response({'error': 'Access denied: Cannot change user role'}, status=status.HTTP_403_FORBIDDEN)
        
        # Remove password from request data if present (we'll handle it separately)
        password = request.data.pop('password', None)
        
        # Update user
        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            user = serializer.save()
            # Update password if provided
            if password:
                user.set_password(password)
                user.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DocumentManagementViewSet(viewsets.ViewSet):
    """
    ViewSet for managing documents and folders
    """
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'], url_path='folder-tree')
    def folder_tree(self, request):
        """Get the folder tree for System Administrator"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        try:
            # Get all folders
            folders = Folder.objects.all()
            serializer = FolderSerializer(folders, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': f'Failed to fetch folder tree: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'], url_path='search')
    def search_documents(self, request):
        """Search documents by various criteria"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        query = request.GET.get('q', '')
        folder_id = request.GET.get('folder_id', '')
        document_type = request.GET.get('document_type', '')
        tag = request.GET.get('tag', '')
        
        documents = Document.objects.all()
        
        if query:
            documents = documents.filter(name__icontains=query) | documents.filter(description__icontains=query)
        
        if folder_id:
            documents = documents.filter(folder_id=folder_id)
            
        if document_type:
            documents = documents.filter(document_type__name__icontains=document_type)
            
        if tag:
            documents = documents.filter(tags__name__icontains=tag)
            
        serializer = self.get_serializer(documents, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], url_path='manage-permissions')
    def manage_permissions(self, request, pk=None):
        """Manage permissions for a specific document"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        # This would be implemented based on the specific permission management requirements
        return Response({'message': 'Permission management endpoint'})
    
    @action(detail=True, methods=['post'], url_path='force-unlock')
    def force_unlock(self, request, pk=None):
        """Force unlock a document"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        try:
            document = Document.objects.get(id=pk)
            document.locked_by = None
            document.locked_at = None
            document.save()
            return Response({'message': 'Document unlocked successfully'})
        except Document.DoesNotExist:
            return Response({'error': 'Document not found'}, status=status.HTTP_404_NOT_FOUND)

class TypeManagementViewSet(viewsets.ViewSet):
    """
    ViewSet for managing document types and correspondents
    """
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'], url_path='document-types')
    def document_types(self, request):
        """Get all document types"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        doc_types = DocumentType.objects.all()
        serializer = DocumentTypeSerializer(doc_types, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='correspondents')
    def correspondents(self, request):
        """Get all correspondents"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        correspondents = Correspondent.objects.all()
        serializer = CorrespondentSerializer(correspondents, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], url_path='document-types/create')
    def create_document_type(self, request):
        """Create a new document type"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        serializer = DocumentTypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], url_path='correspondents/create')
    def create_correspondent(self, request):
        """Create a new correspondent"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        serializer = CorrespondentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['put'], url_path='document-types/update')
    def update_document_type(self, request, pk=None):
        """Update a document type"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        try:
            doc_type = DocumentType.objects.get(id=pk)
            serializer = DocumentTypeSerializer(doc_type, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except DocumentType.DoesNotExist:
            return Response({'error': 'Document type not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['put'], url_path='correspondents/update')
    def update_correspondent(self, request, pk=None):
        """Update a correspondent"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        try:
            correspondent = Correspondent.objects.get(id=pk)
            serializer = CorrespondentSerializer(correspondent, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Correspondent.DoesNotExist:
            return Response({'error': 'Correspondent not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['delete'], url_path='document-types/delete')
    def delete_document_type(self, request, pk=None):
        """Delete a document type"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        try:
            doc_type = DocumentType.objects.get(id=pk)
            doc_type.delete()
            return Response({'message': 'Document type deleted successfully'})
        except DocumentType.DoesNotExist:
            return Response({'error': 'Document type not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['delete'], url_path='correspondents/delete')
    def delete_correspondent(self, request, pk=None):
        """Delete a correspondent"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        try:
            correspondent = Correspondent.objects.get(id=pk)
            correspondent.delete()
            return Response({'message': 'Correspondent deleted successfully'})
        except Correspondent.DoesNotExist:
            return Response({'error': 'Correspondent not found'}, status=status.HTTP_404_NOT_FOUND)

class PermissionManagementViewSet(viewsets.ViewSet):
    """
    ViewSet for managing permissions
    """
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'], url_path='global-role-permissions')
    def global_role_permissions(self, request):
        """Get global role permissions matrix"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        # Define the permissions matrix
        permissions_matrix = {
            'ADMIN': {
                'can_create_folders': True,
                'can_upload_documents': True,
                'can_edit_documents': True,
                'can_delete_documents': True,
                'can_manage_users': True,
                'can_manage_permissions': True,
                'can_view_audit_logs': True,
                'can_manage_workflows': True,
                'can_configure_system': True
            },
            'SENIOR_DEPT_HEAD': {
                'can_create_folders': True,
                'can_upload_documents': True,
                'can_edit_documents': True,
                'can_delete_documents': True,
                'can_manage_users': True,
                'can_manage_permissions': True,
                'can_view_audit_logs': True,
                'can_manage_workflows': True,
                'can_configure_system': False
            },
            'DEPT_HEAD': {
                'can_create_folders': True,
                'can_upload_documents': True,
                'can_edit_documents': True,
                'can_delete_documents': True,
                'can_manage_users': False,
                'can_manage_permissions': False,
                'can_view_audit_logs': False,
                'can_manage_workflows': True,
                'can_configure_system': False
            },
            'EMPLOYEE': {
                'can_create_folders': False,
                'can_upload_documents': True,
                'can_edit_documents': True,
                'can_delete_documents': False,
                'can_manage_users': False,
                'can_manage_permissions': False,
                'can_view_audit_logs': False,
                'can_manage_workflows': False,
                'can_configure_system': False
            }
        }
        
        return Response(permissions_matrix)
    
    @action(detail=False, methods=['get'], url_path='object-level-permissions')
    def object_level_permissions(self, request):
        """Get object-level permissions"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        # This would be implemented based on the specific permission management requirements
        # For now, we'll return a placeholder
        return Response({
            'message': 'Object-level permissions management endpoint',
            'note': 'This would show specific permissions for folders/documents/users/groups'
        })

class SystemConfigurationViewSet(viewsets.ViewSet):
    """
    ViewSet for system configuration
    """
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'], url_path='storage-settings')
    def storage_settings(self, request):
        """Get storage settings"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        # This would be implemented based on the specific storage settings requirements
        # For now, we'll return a placeholder
        return Response({
            'media_root': '/path/to/media/root',
            'storage_quota': '100GB',
            'current_usage': '35GB'
        })
    
    @action(detail=False, methods=['get'], url_path='ocr-settings')
    def ocr_settings(self, request):
        """Get OCR settings"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        # This would be implemented based on the specific OCR settings requirements
        # For now, we'll return a placeholder
        return Response({
            'tesseract_language_packs': ['eng', 'spa', 'fra'],
            'default_ocr_behavior': 'auto'
        })
    
    @action(detail=False, methods=['get'], url_path='email-settings')
    def email_settings(self, request):
        """Get email/notification settings"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        # This would be implemented based on the specific email settings requirements
        # For now, we'll return a placeholder
        return Response({
            'smtp_host': 'smtp.example.com',
            'smtp_port': 587,
            'use_tls': True,
            'sender_email': 'noreply@documentsolutions.com'
        })
    
    @action(detail=False, methods=['get'], url_path='security-policies')
    def security_policies(self, request):
        """Get security policies"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        # This would be implemented based on the specific security policies requirements
        # For now, we'll return a placeholder
        return Response({
            'password_min_length': 8,
            'password_complexity': True,
            'session_timeout': 3600,
            'mfa_required': False
        })
    
    @action(detail=False, methods=['get'], url_path='integration-settings')
    def integration_settings(self, request):
        """Get integration settings"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        # This would be implemented based on the specific integration settings requirements
        # For now, we'll return a placeholder
        return Response({
            'api_keys': [],
            'external_services': []
        })

class AuditLogViewSet(viewsets.ViewSet):
    """
    ViewSet for managing audit logs
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        """Get all audit logs"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        audit_logs = AuditLog.objects.all().order_by('-timestamp')
        serializer = AuditLogSerializer(audit_logs, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        """Get a specific audit log"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        try:
            audit_log = AuditLog.objects.get(id=pk)
            serializer = AuditLogSerializer(audit_log)
            return Response(serializer.data)
        except AuditLog.DoesNotExist:
            return Response({'error': 'Audit log not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'], url_path='search')
    def search(self, request):
        """Search audit logs by various criteria"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        query = request.GET.get('q', '')
        user = request.GET.get('user', '')
        action = request.GET.get('action', '')
        object_type = request.GET.get('object_type', '')
        
        audit_logs = AuditLog.objects.all().order_by('-timestamp')
        
        if query:
            audit_logs = audit_logs.filter(action__icontains=query) | audit_logs.filter(details__icontains=query)
        
        if user:
            audit_logs = audit_logs.filter(user__username__icontains=user)
            
        if action:
            audit_logs = audit_logs.filter(action__icontains=action)
            
        if object_type:
            audit_logs = audit_logs.filter(object_type__icontains=object_type)
            
        serializer = AuditLogSerializer(audit_logs, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='export')
    def export_logs(self, request):
        """Export audit logs"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
        # This would be implemented based on the specific export requirements
        # For now, we'll return a placeholder
        return Response({
            'message': 'Audit logs export functionality',
            'note': 'This would export logs in CSV or other formats'
        })

class DepartmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing departments
    """
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filter departments based on user role"""
        user = self.request.user
        if user.role == 'ADMIN':
            # Admin can see all departments
            return Department.objects.all()
        elif user.role == 'SENIOR_DEPT_HEAD':
            # Senior Dept Head can see their department and sub-departments
            if user.department:
                return Department.objects.filter(name__startswith=user.department)
            else:
                return Department.objects.none()
        elif user.role == 'DEPT_HEAD':
            # Dept Head can see only their department
            if user.department:
                return Department.objects.filter(name=user.department)
            else:
                return Department.objects.none()
        else:
            # Employee has no access to departments
            return Department.objects.none()
    
    def create(self, request, *args, **kwargs):
        """Create a new department based on role hierarchy rules"""
        user = request.user
        
        # Check if user has permission to create departments
        if user.role not in ['ADMIN', 'SENIOR_DEPT_HEAD']:
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
        
        # Validate department creation permissions based on hierarchy
        if user.role == 'ADMIN':
            # System Administrator can create any department
            pass
        elif user.role == 'SENIOR_DEPT_HEAD':
            # Senior Department Head can only create sub-departments within their domain
            parent_dept_id = request.data.get('parent_department')
            if parent_dept_id:
                try:
                    parent_dept = Department.objects.get(id=parent_dept_id)
                    if not parent_dept.name.startswith(user.department):
                        return Response({'error': 'Access denied: Cannot create sub-department outside your domain'}, status=status.HTTP_403_FORBIDDEN)
                except Department.DoesNotExist:
                    return Response({'error': 'Parent department not found'}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({'error': 'Senior Department Head must specify a parent department'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create department
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            department = serializer.save()
            
            # Create a folder for the department
            try:
                from documents.models import Folder
                folder_name = f"{department.name} Documents"
                folder = Folder.objects.create(
                    name=folder_name,
                    owner=user,
                    path=f"/{folder_name}"
                )
                # Log the folder creation in audit logs
                from documents.models import AuditLog
                AuditLog.objects.create(
                    user=user,
                    action="FOLDER_CREATED_FOR_DEPARTMENT",
                    object_type="Folder",
                    object_id=folder.id,
                    details={
                        "department_id": department.id,
                        "department_name": department.name,
                        "folder_name": folder_name
                    }
                )
            except Exception as e:
                # If folder creation fails, log the error but don't fail the department creation
                print(f"Failed to create folder for department {department.name}: {str(e)}")
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        """Update a department with validation"""
        user = request.user
        instance = self.get_object()
        
        # Check if user has permission to update this department
        if user.role == 'ADMIN':
            # Admin can update any department
            pass
        elif user.role == 'SENIOR_DEPT_HEAD':
            # Senior Dept Head can only update departments within their domain
            if not instance.name.startswith(user.department):
                return Response({'error': 'Access denied: Cannot update department outside your domain'}, status=status.HTTP_403_FORBIDDEN)
        elif user.role == 'DEPT_HEAD':
            # Dept Head cannot update departments
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
        else:
            # Employee has no access
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
        
        # Update department
        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        """Delete a department with validation"""
        user = request.user
        instance = self.get_object()
        
        # Check if user has permission to delete this department
        if user.role == 'ADMIN':
            # Admin can delete any department
            pass
        elif user.role == 'SENIOR_DEPT_HEAD':
            # Senior Dept Head can only delete departments within their domain
            if not instance.name.startswith(user.department):
                return Response({'error': 'Access denied: Cannot delete department outside your domain'}, status=status.HTTP_403_FORBIDDEN)
        else:
            # Others cannot delete departments
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
        
        # Delete department
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

