from django.db import models
from django.contrib.auth.models import User
from typing import Any

class Tag(models.Model):
    """Model representing a tag that can be applied to documents."""
    
    name: models.CharField = models.CharField(max_length=100, unique=True)
    color: models.CharField = models.CharField(max_length=7, default='#000000')  # Hex color code
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    
    def __str__(self) -> str:
        """
        Return a string representation of the tag.
        
        Returns:
            str: The name of the tag.
        """
        return self.name

class Correspondent(models.Model):
    """Model representing a correspondent (sender/recipient) of documents."""
    
    name: models.CharField = models.CharField(max_length=255, unique=True)
    email: models.EmailField = models.EmailField(blank=True, null=True)
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    
    def __str__(self) -> str:
        """
        Return a string representation of the correspondent.
        
        Returns:
            str: The name of the correspondent.
        """
        return self.name

class DocumentType(models.Model):
    """Model representing a type/category of document."""
    
    name: models.CharField = models.CharField(max_length=100, unique=True)
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    
    def __str__(self) -> str:
        """
        Return a string representation of the document type.
        
        Returns:
            str: The name of the document type.
        """
        return self.name

class Document(models.Model):
    """Model representing a document in the system."""
    
    title: models.CharField = models.CharField(max_length=255)
    description: models.TextField = models.TextField(blank=True)
    file: models.FileField = models.FileField(upload_to='documents/')
    uploaded_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)
    
    # Classification fields
    correspondent: models.ForeignKey = models.ForeignKey(Correspondent, on_delete=models.SET_NULL, null=True, blank=True)
    document_type: models.ForeignKey = models.ForeignKey(DocumentType, on_delete=models.SET_NULL, null=True, blank=True)
    tags: models.ManyToManyField = models.ManyToManyField(Tag, blank=True)
    
    # OCR and processing fields
    content: models.TextField = models.TextField(blank=True)  # OCR extracted text
    archived_file: models.FileField = models.FileField(upload_to='archived/', blank=True, null=True)  # PDF/A version
    processed: models.BooleanField = models.BooleanField(default=False)
    ocr_status: models.CharField = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('processing', 'Processing'),
            ('completed', 'Completed'),
            ('failed', 'Failed'),
        ],
        default='pending'
    )
    
    # Metadata
    original_filename: models.CharField = models.CharField(max_length=255, blank=True)
    file_size: models.BigIntegerField = models.BigIntegerField(null=True, blank=True)
    mime_type: models.CharField = models.CharField(max_length=100, blank=True)
    
    # Workflow fields
    archived: models.BooleanField = models.BooleanField(default=False)
    
    def __str__(self) -> str:
        """
        Return a string representation of the document.
        
        Returns:
            str: The title of the document.
        """
        return self.title

class DocumentPermission(models.Model):
    """Model representing permissions for a document."""
    
    PERMISSION_LEVELS: list[tuple[str, str]] = [
        ('view', 'View Only'),
        ('edit', 'Edit'),
        ('manage', 'Manage'),
    ]
    
    document: models.ForeignKey = models.ForeignKey(Document, on_delete=models.CASCADE)
    user: models.ForeignKey = models.ForeignKey(User, on_delete=models.CASCADE)
    permission_level: models.CharField = models.CharField(max_length=10, choices=PERMISSION_LEVELS)
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('document', 'user')
    
    def __str__(self) -> str:
        """
        Return a string representation of the document permission.
        
        Returns:
            str: A formatted string showing user, permission level, and document title.
        """
        return f"{self.user.username} - {self.permission_level} - {self.document.title}"

class SharedLink(models.Model):
    """Model representing a shared link for a document."""
    
    document: models.ForeignKey = models.ForeignKey(Document, on_delete=models.CASCADE)
    token: models.CharField = models.CharField(max_length=100, unique=True)
    created_by: models.ForeignKey = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    expires_at: models.DateTimeField = models.DateTimeField(null=True, blank=True)
    is_active: models.BooleanField = models.BooleanField(default=True)
    
    def __str__(self) -> str:
        """
        Return a string representation of the shared link.
        
        Returns:
            str: A formatted string indicating this is a shared link for a document.
        """
        return f"Shared link for {self.document.title}"