"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
from documents.views import DocumentViewSet, TagViewSet, CorrespondentViewSet, DocumentTypeViewSet, FolderViewSet, SharedItemViewSet
from documents import health_views
from processing import views as processing_views
from users import views as user_views

router = routers.DefaultRouter()
router.register(r'documents', DocumentViewSet)
router.register(r'tags', TagViewSet)
router.register(r'correspondents', CorrespondentViewSet)
router.register(r'document_types', DocumentTypeViewSet)
router.register(r'folders', FolderViewSet, basename='folder')
router.register(r'shared-items', SharedItemViewSet, basename='shareditem')  # Added basename parameter
router.register(r'workflows', processing_views.WorkflowTemplateViewSet)
router.register(r'workflow_steps', processing_views.WorkflowStepViewSet)

# Admin routers
admin_router = routers.DefaultRouter()
admin_router.register(r'users', user_views.UserManagementViewSet)
admin_router.register(r'documents', user_views.DocumentManagementViewSet, basename='admin_document')
admin_router.register(r'workflows', processing_views.WorkflowManagementViewSet, basename='workflow_management')
admin_router.register(r'audit-logs', user_views.AuditLogViewSet, basename='audit_log')
admin_router.register(r'departments', user_views.DepartmentViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/admin/', include(admin_router.urls)),
    path('api/auth/login/', user_views.AuthViewSet.as_view({'post': 'login_user'}), name='auth-login'),
    path('api/auth/logout/', user_views.AuthViewSet.as_view({'post': 'logout_user'}), name='auth-logout'),
    path('api/auth/me/', user_views.AuthViewSet.as_view({'get': 'get_current_user'}), name='auth-me'),
    path('api/admin/dashboard/', user_views.AdminDashboardViewSet.as_view({'get': 'dashboard'}), name='admin-dashboard'),
    path('api/admin/types/document-types/', user_views.TypeManagementViewSet.as_view({
        'get': 'document_types',
        'post': 'create_document_type'
    }), name='admin-document-types'),
    path('api/admin/types/correspondents/', user_views.TypeManagementViewSet.as_view({
        'get': 'correspondents',
        'post': 'create_correspondent'
    }), name='admin-correspondents'),
    path('api/admin/types/document-types/<int:pk>/update/', user_views.TypeManagementViewSet.as_view({
        'put': 'update_document_type'
    }), name='admin-update-document-type'),
    path('api/admin/types/correspondents/<int:pk>/update/', user_views.TypeManagementViewSet.as_view({
        'put': 'update_correspondent'
    }), name='admin-update-correspondent'),
    path('api/admin/types/document-types/<int:pk>/delete/', user_views.TypeManagementViewSet.as_view({
        'delete': 'delete_document_type'
    }), name='admin-delete-document-type'),
    path('api/admin/types/correspondents/<int:pk>/delete/', user_views.TypeManagementViewSet.as_view({
        'delete': 'delete_correspondent'
    }), name='admin-delete-correspondent'),
    path('api/admin/permissions/global-role-permissions/', user_views.PermissionManagementViewSet.as_view({
        'get': 'global_role_permissions'
    }), name='admin-global-role-permissions'),
    path('api/admin/permissions/object-level-permissions/', user_views.PermissionManagementViewSet.as_view({
        'get': 'object_level_permissions'
    }), name='admin-object-level-permissions'),
    path('api/admin/workflows/', processing_views.WorkflowManagementViewSet.as_view({
        'get': 'list'
    }), name='admin-workflows'),
    path('api/admin/workflows/<int:pk>/', processing_views.WorkflowManagementViewSet.as_view({
        'get': 'retrieve'
    }), name='admin-workflow-detail'),
    path('api/admin/workflows/create/', processing_views.WorkflowManagementViewSet.as_view({
        'post': 'create_workflow'
    }), name='admin-create-workflow'),
    path('api/admin/workflows/<int:pk>/update/', processing_views.WorkflowManagementViewSet.as_view({
        'put': 'update_workflow'
    }), name='admin-update-workflow'),
    path('api/admin/workflows/<int:pk>/activate/', processing_views.WorkflowManagementViewSet.as_view({
        'post': 'activate_workflow'
    }), name='admin-activate-workflow'),
    path('api/admin/workflows/<int:pk>/deactivate/', processing_views.WorkflowManagementViewSet.as_view({
        'post': 'deactivate_workflow'
    }), name='admin-deactivate-workflow'),
    path('api/admin/workflows/active-workflows/', processing_views.WorkflowManagementViewSet.as_view({
        'get': 'active_workflows'
    }), name='admin-active-workflows'),
    path('api/admin/audit-logs/', user_views.AuditLogViewSet.as_view({
        'get': 'list'
    }), name='admin-audit-logs'),
    path('api/admin/audit-logs/<int:pk>/', user_views.AuditLogViewSet.as_view({
        'get': 'retrieve'
    }), name='admin-audit-log-detail'),
    path('api/admin/audit-logs/search/', user_views.AuditLogViewSet.as_view({
        'get': 'search'
    }), name='admin-search-audit-logs'),
    path('api/admin/audit-logs/export/', user_views.AuditLogViewSet.as_view({
        'get': 'export_logs'
    }), name='admin-export-audit-logs'),
    path('api/admin/config/storage-settings/', user_views.SystemConfigurationViewSet.as_view({
        'get': 'storage_settings'
    }), name='admin-storage-settings'),
    path('api/admin/config/ocr-settings/', user_views.SystemConfigurationViewSet.as_view({
        'get': 'ocr_settings'
    }), name='admin-ocr-settings'),
    path('api/admin/config/email-settings/', user_views.SystemConfigurationViewSet.as_view({
        'get': 'email_settings'
    }), name='admin-email-settings'),
    path('api/admin/config/security-policies/', user_views.SystemConfigurationViewSet.as_view({
        'get': 'security_policies'
    }), name='admin-security-policies'),
    path('api/admin/config/integration-settings/', user_views.SystemConfigurationViewSet.as_view({
        'get': 'integration_settings'
    }), name='admin-integration-settings'),
    path('api/admin/documents/folder-tree/', user_views.DocumentManagementViewSet.as_view({
        'get': 'folder_tree'
    }), name='admin-folder-tree'),
    path('api/health/', health_views.HealthCheckView.as_view(), name='health-check'),
    path('api/statistics/', health_views.SystemStatisticsView.as_view(), name='system-statistics'),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)