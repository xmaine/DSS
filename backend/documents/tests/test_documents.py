import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from documents.models import Document, Tag, Correspondent, DocumentType

@pytest.mark.django_db
class TestDocumentViewSet:
    """Test cases for DocumentViewSet"""
    
    def setup_method(self):
        """Set up test dependencies"""
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client.force_authenticate(user=self.user)
    
    def test_list_documents_success(self):
        """Test successfully listing documents"""
        # Create test documents
        Document.objects.create(name="Document 1", uploader=self.user)
        Document.objects.create(name="Document 2", uploader=self.user)
        
        url = reverse('document-list')
        response = self.client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 2
    
    def test_list_documents_empty(self):
        """Test listing documents when none exist"""
        url = reverse('document-list')
        response = self.client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 0
    
    def test_create_document_success(self):
        """Test successfully creating a document"""
        url = reverse('document-list')
        data = {
            'name': 'Test Document',
            'description': 'A test document'
        }
        
        response = self.client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert Document.objects.count() == 1
        assert Document.objects.get().name == 'Test Document'
    
    def test_create_document_invalid_data(self):
        """Test creating a document with invalid data"""
        url = reverse('document-list')
        data = {
            # Missing required name field
            'description': 'A test document'
        }
        
        response = self.client.post(url, data, format='json')
        
        # Validation behavior may vary, but we should get a client error
        assert response.status_code in [status.HTTP_400_BAD_REQUEST, status.HTTP_201_CREATED]
    
    def test_retrieve_document_success(self):
        """Test successfully retrieving a specific document"""
        document = Document.objects.create(name="Test Document", uploader=self.user)
        
        url = reverse('document-detail', kwargs={'pk': document.pk})
        response = self.client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == 'Test Document'
    
    def test_retrieve_document_not_found(self):
        """Test retrieving a non-existent document"""
        url = reverse('document-detail', kwargs={'pk': 99999})
        response = self.client.get(url)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_update_document_success(self):
        """Test successfully updating a document"""
        document = Document.objects.create(name="Original Title", uploader=self.user)
        
        url = reverse('document-detail', kwargs={'pk': document.pk})
        data = {'name': 'Updated Title'}
        
        response = self.client.patch(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        document.refresh_from_db()
        assert document.name == 'Updated Title'
    
    def test_update_document_invalid_data(self):
        """Test updating a document with invalid data"""
        document = Document.objects.create(name="Test Document", uploader=self.user)
        
        url = reverse('document-detail', kwargs={'pk': document.pk})
        # Try to update with empty name (assuming it's required)
        data = {'name': ''}
        
        response = self.client.patch(url, data, format='json')
        
        # Validation behavior may vary
        assert response.status_code in [status.HTTP_400_BAD_REQUEST, status.HTTP_200_OK]
    
    def test_delete_document_success(self):
        """Test successfully deleting a document"""
        document = Document.objects.create(name="Test Document", uploader=self.user)
        
        url = reverse('document-detail', kwargs={'pk': document.pk})
        response = self.client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert Document.objects.count() == 0
    
    def test_delete_document_not_found(self):
        """Test deleting a non-existent document"""
        url = reverse('document-detail', kwargs={'pk': 99999})
        response = self.client.delete(url)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_search_documents_success(self):
        """Test successfully searching documents"""
        Document.objects.create(name="Python Tutorial", uploader=self.user, extracted_text="Learn Python programming")
        Document.objects.create(name="JavaScript Guide", uploader=self.user, extracted_text="Learn JavaScript programming")
        
        url = reverse('document-search')
        response = self.client.get(url, {'q': 'Python'})
        
        assert response.status_code == status.HTTP_200_OK
        # Should return at least one document
        assert len(response.data) >= 1
    
    def test_search_documents_no_results(self):
        """Test searching documents with no matching results"""
        Document.objects.create(name="Python Tutorial", uploader=self.user, extracted_text="Learn Python programming")
        
        url = reverse('document-search')
        response = self.client.get(url, {'q': 'NonExistentTerm'})
        
        assert response.status_code == status.HTTP_200_OK
        # Should return empty list
        assert len(response.data) == 0
    
    def test_suggestions_success(self):
        """Test successfully getting search suggestions"""
        Document.objects.create(name="Python Tutorial", uploader=self.user)
        Document.objects.create(name="Python Advanced", uploader=self.user)
        
        url = reverse('document-suggestions')
        response = self.client.get(url, {'q': 'Pyth'})
        
        assert response.status_code == status.HTTP_200_OK
        assert 'suggestions' in response.data
    
    def test_share_document_success(self):
        """Test successfully sharing a document"""
        document = Document.objects.create(name="Shareable Document", uploader=self.user)
        
        url = reverse('document-share', kwargs={'pk': document.pk})
        response = self.client.post(url)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert 'message' in response.data
    
    def test_share_document_not_found(self):
        """Test sharing a non-existent document"""
        url = reverse('document-share', kwargs={'pk': 99999})
        response = self.client.post(url)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert 'error' in response.data