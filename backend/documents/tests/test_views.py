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
    
    def test_list_documents(self):
        """Test listing documents"""
        # Create test documents
        Document.objects.create(title="Document 1")
        Document.objects.create(title="Document 2")
        
        url = reverse('document-list')
        response = self.client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 2
    
    def test_create_document(self):
        """Test creating a document"""
        url = reverse('document-list')
        data = {
            'title': 'Test Document',
            'description': 'A test document'
        }
        
        response = self.client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert Document.objects.count() == 1
        assert Document.objects.get().title == 'Test Document'
    
    def test_retrieve_document(self):
        """Test retrieving a specific document"""
        document = Document.objects.create(title="Test Document")
        
        url = reverse('document-detail', kwargs={'pk': document.pk})
        response = self.client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == 'Test Document'
    
    def test_update_document(self):
        """Test updating a document"""
        document = Document.objects.create(title="Original Title")
        
        url = reverse('document-detail', kwargs={'pk': document.pk})
        data = {'title': 'Updated Title'}
        
        response = self.client.patch(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        document.refresh_from_db()
        assert document.title == 'Updated Title'
    
    def test_delete_document(self):
        """Test deleting a document"""
        document = Document.objects.create(title="Test Document")
        
        url = reverse('document-detail', kwargs={'pk': document.pk})
        response = self.client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert Document.objects.count() == 0

@pytest.mark.django_db
class TestTagViewSet:
    """Test cases for TagViewSet"""
    
    def setup_method(self):
        """Set up test dependencies"""
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client.force_authenticate(user=self.user)
    
    def test_list_tags(self):
        """Test listing tags"""
        Tag.objects.create(name="Important")
        Tag.objects.create(name="Work")
        
        url = reverse('tag-list')
        response = self.client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 2
    
    def test_create_tag(self):
        """Test creating a tag"""
        url = reverse('tag-list')
        data = {
            'name': 'Test Tag',
            'color': '#FF0000'
        }
        
        response = self.client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert Tag.objects.count() == 1
        assert Tag.objects.get().name == 'Test Tag'

@pytest.mark.django_db
class TestSearchAction:
    """Test cases for document search functionality"""
    
    def setup_method(self):
        """Set up test dependencies"""
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client.force_authenticate(user=self.user)
    
    def test_search_documents(self):
        """Test searching documents"""
        Document.objects.create(title="Python Tutorial", content="Learn Python programming")
        Document.objects.create(title="JavaScript Guide", content="Learn JavaScript programming")
        
        url = reverse('document-search')
        response = self.client.get(url, {'q': 'Python'})
        
        assert response.status_code == status.HTTP_200_OK
        # Should return at least one document
        assert len(response.data) >= 1