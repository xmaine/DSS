import pytest
from django.contrib.auth.models import User
from documents.models import Document, Tag, Correspondent, DocumentType, DocumentPermission, SharedLink

@pytest.mark.django_db
class TestDocumentModel:
    """Test cases for Document model"""
    
    def test_document_creation(self):
        """Test creating a document with minimal fields"""
        document = Document.objects.create(
            title="Test Document",
            description="A test document"
        )
        assert document.title == "Test Document"
        assert document.description == "A test document"
        assert document.processed == False
        assert document.ocr_status == "pending"
    
    def test_document_with_file(self):
        """Test creating a document with a file"""
        document = Document.objects.create(
            title="Test Document with File",
            file="test_file.pdf"
        )
        assert document.file.name == "test_file.pdf"
    
    def test_document_str_representation(self):
        """Test document string representation"""
        document = Document.objects.create(title="Test Document")
        assert str(document) == "Test Document"

@pytest.mark.django_db
class TestTagModel:
    """Test cases for Tag model"""
    
    def test_tag_creation(self):
        """Test creating a tag"""
        tag = Tag.objects.create(
            name="Important",
            color="#FF0000"
        )
        assert tag.name == "Important"
        assert tag.color == "#FF0000"
    
    def test_tag_str_representation(self):
        """Test tag string representation"""
        tag = Tag.objects.create(name="Important")
        assert str(tag) == "Important"

@pytest.mark.django_db
class TestCorrespondentModel:
    """Test cases for Correspondent model"""
    
    def test_correspondent_creation(self):
        """Test creating a correspondent"""
        correspondent = Correspondent.objects.create(
            name="John Doe",
            email="john@example.com"
        )
        assert correspondent.name == "John Doe"
        assert correspondent.email == "john@example.com"
    
    def test_correspondent_str_representation(self):
        """Test correspondent string representation"""
        correspondent = Correspondent.objects.create(name="John Doe")
        assert str(correspondent) == "John Doe"

@pytest.mark.django_db
class TestDocumentTypeModel:
    """Test cases for DocumentType model"""
    
    def test_document_type_creation(self):
        """Test creating a document type"""
        doc_type = DocumentType.objects.create(name="Invoice")
        assert doc_type.name == "Invoice"
    
    def test_document_type_str_representation(self):
        """Test document type string representation"""
        doc_type = DocumentType.objects.create(name="Invoice")
        assert str(doc_type) == "Invoice"

@pytest.mark.django_db
class TestDocumentPermissionModel:
    """Test cases for DocumentPermission model"""
    
    def test_document_permission_creation(self):
        """Test creating a document permission"""
        user = User.objects.create_user(username="testuser", password="testpass")
        document = Document.objects.create(title="Test Document")
        
        permission = DocumentPermission.objects.create(
            document=document,
            user=user,
            permission_level="edit"
        )
        assert permission.document == document
        assert permission.user == user
        assert permission.permission_level == "edit"
    
    def test_document_permission_str_representation(self):
        """Test document permission string representation"""
        user = User.objects.create_user(username="testuser", password="testpass")
        document = Document.objects.create(title="Test Document")
        
        permission = DocumentPermission.objects.create(
            document=document,
            user=user,
            permission_level="edit"
        )
        expected_str = f"{user.username} - edit - {document.title}"
        assert str(permission) == expected_str

@pytest.mark.django_db
class TestSharedLinkModel:
    """Test cases for SharedLink model"""
    
    def test_shared_link_creation(self):
        """Test creating a shared link"""
        user = User.objects.create_user(username="testuser", password="testpass")
        document = Document.objects.create(title="Test Document")
        
        shared_link = SharedLink.objects.create(
            document=document,
            token="abc123",
            created_by=user,
            is_active=True
        )
        assert shared_link.document == document
        assert shared_link.token == "abc123"
        assert shared_link.created_by == user
        assert shared_link.is_active == True
    
    def test_shared_link_str_representation(self):
        """Test shared link string representation"""
        user = User.objects.create_user(username="testuser", password="testpass")
        document = Document.objects.create(title="Test Document")
        
        shared_link = SharedLink.objects.create(
            document=document,
            token="abc123",
            created_by=user,
            is_active=True
        )
        expected_str = f"Shared link for {document.title}"
        assert str(shared_link) == expected_str