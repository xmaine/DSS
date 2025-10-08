import pytest
from unittest.mock import patch, MagicMock
from documents.models import Document, Tag, Correspondent, DocumentType
from documents.search import DocumentSearchService
from documents.health_check import SystemHealthCheckService
from documents.storage import DocumentStorageService

@pytest.mark.django_db
class TestDocumentSearchService:
    """Test cases for DocumentSearchService"""
    
    def test_search_documents_with_query(self):
        """Test searching documents with a query"""
        # Create test documents
        doc1 = Document.objects.create(title="Test Document 1", content="This is a test document")
        doc2 = Document.objects.create(title="Another Document", content="This is another document")
        
        search_service = DocumentSearchService()
        results = search_service.search_documents("test")
        
        # Should find the first document
        assert doc1 in results
        assert doc2 not in results
    
    def test_search_documents_empty_query(self):
        """Test searching documents with empty query returns all documents"""
        doc1 = Document.objects.create(title="Test Document 1")
        doc2 = Document.objects.create(title="Test Document 2")
        
        search_service = DocumentSearchService()
        results = search_service.search_documents("")
        
        # Should return all documents
        assert doc1 in results
        assert doc2 in results
    
    def test_get_search_suggestions(self):
        """Test getting search suggestions"""
        # Create test data
        Document.objects.create(title="Python Programming")
        Tag.objects.create(name="Python")
        Correspondent.objects.create(name="Python Software Foundation")
        
        search_service = DocumentSearchService()
        suggestions = search_service.get_search_suggestions("Python")
        
        # Should return suggestions containing "Python"
        assert len(suggestions) > 0
        assert any("Python" in suggestion for suggestion in suggestions)

@pytest.mark.django_db
class TestSystemHealthCheckService:
    """Test cases for SystemHealthCheckService"""
    
    def test_get_system_statistics(self):
        """Test getting system statistics"""
        # Create test data
        Document.objects.create(title="Test Document")
        Tag.objects.create(name="Test Tag")
        Correspondent.objects.create(name="Test Correspondent")
        DocumentType.objects.create(name="Test Type")
        
        health_service = SystemHealthCheckService()
        stats = health_service.get_system_statistics()
        
        # Check that statistics are returned
        assert 'documents' in stats
        assert 'classification' in stats
        assert 'processing' in stats
        assert 'storage' in stats
        
        # Check specific counts
        assert stats['documents']['total'] >= 1
        assert stats['classification']['tags'] >= 1

@pytest.mark.django_db
class TestDocumentStorageService:
    """Test cases for DocumentStorageService"""
    
    @patch('documents.storage.os.path.exists')
    def test_verify_document_integrity_valid(self, mock_exists):
        """Test verifying document integrity for valid document"""
        mock_exists.return_value = True
        
        document = Document.objects.create(
            title="Test Document",
            file="test.pdf",
            file_size=1024
        )
        
        with patch('documents.storage.os.path.getsize') as mock_getsize:
            mock_getsize.return_value = 1024
            
            storage_service = DocumentStorageService()
            result = storage_service.verify_document_integrity(document.id)
            
            assert result['valid'] == True
            assert len(result['issues']) == 0
    
    @patch('documents.storage.os.path.exists')
    def test_verify_document_integrity_missing_file(self, mock_exists):
        """Test verifying document integrity for missing file"""
        mock_exists.return_value = False
        
        document = Document.objects.create(title="Test Document", file="missing.pdf")
        
        storage_service = DocumentStorageService()
        result = storage_service.verify_document_integrity(document.id)
        
        assert result['valid'] == False
        assert 'File does not exist' in result['issues']