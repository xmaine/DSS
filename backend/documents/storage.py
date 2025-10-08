import os
import shutil
from django.conf import settings
from django.utils import timezone
from .models import Document, DocumentType
from typing import Dict, Any, Optional

class DocumentStorageService:
    """Service to handle document storage and organization."""
    
    def organize_document_storage(self, document_id: int) -> bool:
        """
        Organize document storage according to configured rules.
        
        Args:
            document_id (int): The ID of the document to organize.
            
        Returns:
            bool: True if organization was successful, False otherwise.
        """
        try:
            document = Document.objects.get(id=document_id)
            
            # Generate organized path based on document properties
            organized_path: str = self._generate_organized_path(document)
            
            # Move document to organized location if needed
            if organized_path != document.file.name:
                self._move_document(document, organized_path)
            
            return True
        except Document.DoesNotExist:
            print(f"Document with ID {document_id} does not exist")
            return False
        except Exception as e:
            print(f"Error organizing storage for document {document_id}: {str(e)}")
            return False
    
    def _generate_organized_path(self, document: Document) -> str:
        """
        Generate organized storage path based on document properties.
        
        Args:
            document (Document): The document to generate a path for.
            
        Returns:
            str: The organized storage path.
        """
        # Default path structure: documents/{year}/{month}/{day}/{document_id}_{filename}
        now = timezone.now()
        year: str = now.strftime('%Y')
        month: str = now.strftime('%m')
        day: str = now.strftime('%d')
        
        # Create filename with document ID prefix to ensure uniqueness
        filename: str = f"{document.id}_{document.original_filename or document.file.name.split('/')[-1]}"
        
        # Generate path
        organized_path: str = os.path.join('documents', year, month, day, filename)
        return organized_path
    
    def _move_document(self, document: Document, new_path: str) -> None:
        """
        Move document file to new location.
        
        Args:
            document (Document): The document to move.
            new_path (str): The new path for the document.
        """
        # Get current file path
        current_path: str = document.file.path
        
        # Generate new file path
        new_file_path: str = os.path.join(settings.MEDIA_ROOT, new_path)
        
        # Create directory structure if it doesn't exist
        os.makedirs(os.path.dirname(new_file_path), exist_ok=True)
        
        # Move file
        shutil.move(current_path, new_file_path)
        
        # Update document model
        document.file.name = new_path
        document.save()
    
    def organize_all_documents(self) -> int:
        """
        Organize storage for all documents.
        
        Returns:
            int: The number of documents that were organized.
        """
        documents = Document.objects.all()
        organized_count: int = 0
        
        for document in documents:
            if self.organize_document_storage(document.id):
                organized_count += 1
        
        return organized_count
    
    def verify_document_integrity(self, document_id: int) -> Dict[str, Any]:
        """
        Verify document file integrity.
        
        Args:
            document_id (int): The ID of the document to verify.
            
        Returns:
            dict: Verification result with validity status and issues.
        """
        try:
            document = Document.objects.get(id=document_id)
            
            # Check if file exists
            if not os.path.exists(document.file.path):
                return {
                    'valid': False,
                    'issues': ['File does not exist']
                }
            
            # Check file size
            actual_size: int = os.path.getsize(document.file.path)
            if document.file_size and document.file_size != actual_size:
                return {
                    'valid': False,
                    'issues': [f'File size mismatch: expected {document.file_size}, got {actual_size}']
                }
            
            return {
                'valid': True,
                'issues': []
            }
        except Document.DoesNotExist:
            return {
                'valid': False,
                'issues': [f'Document with ID {document_id} does not exist']
            }
        except Exception as e:
            return {
                'valid': False,
                'issues': [f'Error verifying document: {str(e)}']
            }
    
    def get_storage_statistics(self) -> Dict[str, Any]:
        """
        Get storage statistics.
        
        Returns:
            dict: Storage statistics data.
        """
        total_documents: int = Document.objects.count()
        
        # Calculate total storage used
        total_size: int = 0
        documents = Document.objects.all()
        for document in documents:
            if document.file_size:
                total_size += document.file_size
        
        # Get document type distribution
        doc_type_stats: Dict[str, int] = {}
        for doc_type in DocumentType.objects.all():
            count: int = Document.objects.filter(document_type=doc_type).count()
            if count > 0:
                doc_type_stats[doc_type.name] = count
        
        return {
            'total_documents': total_documents,
            'total_storage_bytes': total_size,
            'document_types': doc_type_stats
        }