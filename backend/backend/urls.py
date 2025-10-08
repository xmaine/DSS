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
from documents import views as document_views
from documents import health_views
from processing import views as processing_views

router = routers.DefaultRouter()
router.register(r'documents', document_views.DocumentViewSet)
router.register(r'tags', document_views.TagViewSet)
router.register(r'correspondents', document_views.CorrespondentViewSet)
router.register(r'document_types', document_views.DocumentTypeViewSet)
router.register(r'document_permissions', document_views.DocumentPermissionViewSet)
router.register(r'shared_links', document_views.SharedLinkViewSet)
router.register(r'email_accounts', processing_views.EmailAccountViewSet)
router.register(r'email_rules', processing_views.EmailRuleViewSet)
router.register(r'workflows', processing_views.WorkflowViewSet)
router.register(r'workflow_steps', processing_views.WorkflowStepViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/health/', health_views.HealthCheckView.as_view(), name='health-check'),
    path('api/statistics/', health_views.SystemStatisticsView.as_view(), name='system-statistics'),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)