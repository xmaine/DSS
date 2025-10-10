import os
from django.conf import settings
from django.db import connection
from .models import Document, Tag, Correspondent, DocumentType
from processing.models import WorkflowTemplate
from typing import Dict, Any, Union

class SystemHealthCheckService:
    """Service to check system health and integrity."""
    
    def run_health_check(self) -> Dict[str, Any]:
        """
        Run comprehensive health check of the system.
        
        Returns:
            dict: Health check results for all components.
        """
        results: Dict[str, Any] = {
            'database': self._check_database(),
            'storage': self._check_storage(),
            'documents': self._check_documents(),
            'processing': self._check_processing(),
            'permissions': self._check_permissions()
        }
        
        # Overall health status
        results['overall_healthy'] = all(result['healthy'] for result in results.values())
        
        return results
    
    def _check_database(self) -> Dict[str, Any]:
        """
        Check database connectivity and basic functionality.
        
        Returns:
            dict: Database health status and details.
        """
        try:
            # Test database connection
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            
            # Check if essential tables exist and have data
            tables_check: Dict[str, int] = {
                'documents': Document.objects.count(),
                'tags': Tag.objects.count(),
                'correspondents': Correspondent.objects.count(),
                'document_types': DocumentType.objects.count()
            }
            
            return {
                'healthy': True,
                'details': 'Database connection successful',
                'tables': tables_check
            }
        except Exception as e:
            return {
                'healthy': False,
                'details': f'Database check failed: {str(e)}',
                'tables': {}
            }
    
    def _check_storage(self) -> Dict[str, Any]:
        """
        Check storage availability and document files.
        
        Returns:
            dict: Storage health status and details.
        """
        try:
            # Check if media root exists
            if not os.path.exists(settings.MEDIA_ROOT):
                return {
                    'healthy': False,
                    'details': f'Media root directory does not exist: {settings.MEDIA_ROOT}'
                }
            
            # Check available disk space (simplified)
            stat = os.statvfs(settings.MEDIA_ROOT) if hasattr(os, 'statvfs') else None
            if stat:
                free_space = stat.f_bavail * stat.f_frsize
                # Check if we have at least 100MB free
                if free_space < 100 * 1024 * 1024:  # 100MB
                    return {
                        'healthy': False,
                        'details': f'Low disk space: {free_space / (1024*1024):.2f}MB free'
                    }
            
            return {
                'healthy': True,
                'details': 'Storage check passed'
            }
        except Exception as e:
            return {
                'healthy': False,
                'details': f'Storage check failed: {str(e)}'
            }
    
    def _check_documents(self) -> Dict[str, Any]:
        """
        Check document integrity.
        
        Returns:
            dict: Document health status and details.
        """
        try:
            total_documents: int = Document.objects.count()
            # processed_documents: int = Document.objects.filter(processed=True).count()
            # pending_documents: int = Document.objects.filter(ocr_status='pending').count()
            
            # Check for documents with missing files (simplified)
            missing_files: int = 0
            for document in Document.objects.all()[:100]:  # Check first 100 for performance
                if document.current_version and not os.path.exists(document.current_version.file.path):
                    missing_files += 1
            
            return {
                'healthy': missing_files == 0,
                'details': f'{total_documents} total documents, {missing_files} missing files',
                'missing_files': missing_files
            }
        except Exception as e:
            return {
                'healthy': False,
                'details': f'Document check failed: {str(e)}',
                'missing_files': 0
            }
    
    def _check_processing(self) -> Dict[str, Any]:
        """
        Check processing system status.
        
        Returns:
            dict: Processing system health status and details.
        """
        try:
            workflows: int = WorkflowTemplate.objects.filter(is_active=True).count()
            
            return {
                'healthy': True,
                'details': f'{workflows} active workflows'
            }
        except Exception as e:
            return {
                'healthy': False,
                'details': f'Processing check failed: {str(e)}'
            }
    
    def _check_permissions(self) -> Dict[str, Any]:
        """
        Check permissions system.
        
        Returns:
            dict: Permission system health status and details.
        """
        try:
            # This is a simplified check
            # In a real implementation, you would check more detailed permission settings
            return {
                'healthy': True,
                'details': 'Permission system initialized'
            }
        except Exception as e:
            return {
                'healthy': False,
                'details': f'Permission check failed: {str(e)}'
            }
    
    def get_system_statistics(self) -> Dict[str, Any]:
        """
        Get comprehensive system statistics.
        
        Returns:
            dict: System statistics data.
        """
        stats: Dict[str, Any] = {
            'documents': {
                'total': Document.objects.count(),
                # 'processed': Document.objects.filter(processed=True).count(),
                # 'unprocessed': Document.objects.filter(processed=False).count(),
                'active': Document.objects.filter(is_active=True).count()
            },
            'classification': {
                'tags': Tag.objects.count(),
                'correspondents': Correspondent.objects.count(),
                'document_types': DocumentType.objects.count()
            },
            'processing': {
                'workflows': WorkflowTemplate.objects.filter(is_active=True).count()
            },
            'storage': {
                'media_root': settings.MEDIA_ROOT,
                'total_documents_size': self._calculate_total_documents_size()
            }
        }
        
        return stats
    
    def _calculate_total_documents_size(self) -> int:
        """
        Calculate total size of all document files.
        
        Returns:
            int: Total size in bytes.
        """
        try:
            total_size: int = 0
            for document in Document.objects.all():
                if document.current_version and os.path.exists(document.current_version.file.path):
                    total_size += document.current_version.file_size
            return total_size
        except Exception:
            return 0