import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from documents.models import Document, SharedItem, Folder

@pytest.mark.django_db
class TestSharedItemViewSet:
    """Test cases for SharedItemViewSet"""
    
    def setup_method(self):
        """Set up test dependencies"""
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='testuser1', password='testpass1')
        self.user2 = User.objects.create_user(username='testuser2', password='testpass2')
        self.client.force_authenticate(user=self.user1)
    
    def test_shared_with_me_success(self):
        """Test successfully retrieving items shared with the current user"""
        # Create a document and share it with user1
        document = Document.objects.create(
            name="Test Document",
            uploader=self.user2
        )
        
        SharedItem.objects.create(
            document=document,
            shared_by=self.user2,
            shared_with_user=self.user1,
            permission_codes=['view'],
            is_active=True
        )
        
        url = reverse('shareditem-shared-with-me')
        response = self.client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['name'] == "Test Document"
        assert response.data[0]['shared_by'] == "testuser2"
    
    def test_shared_with_me_empty(self):
        """Test retrieving shared items when none exist"""
        # Ensure no items are shared with user1
        url = reverse('shareditem-shared-with-me')
        response = self.client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 0
    
    def test_shared_with_me_inactive_items_excluded(self):
        """Test that inactive shared items are not returned"""
        # Create an inactive shared item
        document = Document.objects.create(
            name="Inactive Document",
            uploader=self.user2
        )
        
        SharedItem.objects.create(
            document=document,
            shared_by=self.user2,
            shared_with_user=self.user1,
            permission_codes=['view'],
            is_active=False  # Inactive item
        )
        
        url = reverse('shareditem-shared-with-me')
        response = self.client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 0
    
    def test_shared_by_me_success(self):
        """Test successfully retrieving items shared by the current user"""
        # Create a document and share it with user2
        document = Document.objects.create(
            name="Shared Document",
            uploader=self.user1  # Current user is the uploader
        )
        
        SharedItem.objects.create(
            document=document,
            shared_by=self.user1,  # Current user is the sharer
            shared_with_user=self.user2,
            permission_codes=['view'],
            is_active=True
        )
        
        url = reverse('shareditem-shared-by-me')
        response = self.client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['name'] == "Shared Document"
        assert response.data[0]['shared_with'] == "testuser2"
    
    def test_shared_by_me_empty(self):
        """Test retrieving items shared by user when none exist"""
        # Ensure current user hasn't shared anything
        url = reverse('shareditem-shared-by-me')
        response = self.client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 0
    
    def test_shared_by_me_inactive_items_excluded(self):
        """Test that inactive shared items are not returned"""
        # Create an inactive shared item
        document = Document.objects.create(
            name="Inactive Shared Document",
            uploader=self.user1
        )
        
        SharedItem.objects.create(
            document=document,
            shared_by=self.user1,
            shared_with_user=self.user2,
            permission_codes=['view'],
            is_active=False  # Inactive item
        )
        
        url = reverse('shareditem-shared-by-me')
        response = self.client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 0
    
    def test_shared_items_folder_support(self):
        """Test shared items work with folders as well as documents"""
        # Create a folder and share it
        folder = Folder.objects.create(
            name="Test Folder",
            owner=self.user2
        )
        
        SharedItem.objects.create(
            folder=folder,
            shared_by=self.user2,
            shared_with_user=self.user1,
            permission_codes=['view'],
            is_active=True
        )
        
        url = reverse('shareditem-shared-with-me')
        response = self.client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['name'] == "Test Folder"
        assert response.data[0]['type'] == "folder"