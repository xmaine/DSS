# This file has been refactored to remove duplicate tests.
# Document and tag tests have been moved to separate files with more comprehensive coverage.

import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from documents.models import Document, Tag, Correspondent, DocumentType

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
        Document.objects.create(name="Python Tutorial", extracted_text="Learn Python programming", uploader=self.user)
        Document.objects.create(name="JavaScript Guide", extracted_text="Learn JavaScript programming", uploader=self.user)
        
        url = reverse('document-search')
        response = self.client.get(url, {'q': 'Python'})
        
        assert response.status_code == status.HTTP_200_OK
        # Should return at least one document
        assert len(response.data) >= 1