import uuid
from django.db import models
from typing import Any

# Use the custom user model
from users.models import CustomUser

# For backward compatibility, we'll alias CustomUser to User
User = CustomUser

class Folder(models.Model):
    """Model representing a folder in the document hierarchy."""
    
    name = models.CharField(max_length=255)
    parent_folder = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subfolders')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_folders')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    path = models.TextField()  # Materialized path for efficient hierarchy queries
    
    def __str__(self):
        return self.name

class DocumentType(models.Model):
    """Model representing a type/category of document."""
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.name

class Correspondent(models.Model):
    """Model representing a correspondent (sender/recipient) of documents."""
    
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.name

class Tag(models.Model):
    """Model representing a tag that can be applied to documents."""
    
    name = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.name

class Document(models.Model):
    """Model representing a document in the system."""
    
    uuid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE, null=True, blank=True, related_name='documents')
    document_type = models.ForeignKey(DocumentType, on_delete=models.SET_NULL, null=True, blank=True)
    correspondent = models.ForeignKey(Correspondent, on_delete=models.SET_NULL, null=True, blank=True)
    uploader = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_documents')
    current_version = models.ForeignKey('DocumentVersion', on_delete=models.SET_NULL, null=True, blank=True, related_name='current_for_documents')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    locked_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='locked_documents')
    locked_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    extracted_text = models.TextField(blank=True, null=True)
    tags = models.ManyToManyField(Tag, through='DocumentTag')
    
    def __str__(self):
        return self.name

class DocumentTag(models.Model):
    """Model representing the many-to-many relationship between documents and tags."""
    
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ('document', 'tag')

class DocumentVersion(models.Model):
    """Model representing a version of a document."""
    
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='versions')
    version_number = models.DecimalField(max_digits=5, decimal_places=2)
    file = models.FileField(upload_to='documents/')
    file_size = models.BigIntegerField()
    file_type = models.CharField(max_length=50)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    checksum = models.CharField(max_length=64, blank=True, null=True)
    comment = models.TextField(blank=True, null=True)
    is_current = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.document.name} v{self.version_number}"

class DocumentRating(models.Model):
    """Model representing a user's rating of a document."""
    
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.SmallIntegerField()  # 1-5 stars
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('document', 'user')
    
    def __str__(self):
        return f"{self.user.username} rating {self.rating} for {self.document.name}"

class Annotation(models.Model):
    """Model representing an annotation on a document version."""
    
    document_version = models.ForeignKey(DocumentVersion, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    page_number = models.IntegerField(null=True, blank=True)
    coords = models.CharField(max_length=255, blank=True, null=True)  # JSON or string representing coordinates
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Annotation by {self.user.username} on {self.document_version.document.name}"

class SharedItem(models.Model):
    """Model representing a shared document or folder.
    
    This model is specifically for explicit, ad-hoc sharing instances by a user.
    It records when one user shares an item, and to whom.
    Crucially, SharedItem creates or modifies guardian permissions rather than 
    being the sole source of truth for access.
    """
    
    document = models.ForeignKey(Document, on_delete=models.CASCADE, null=True, blank=True)
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE, null=True, blank=True)
    shared_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shared_items')
    shared_with_user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='received_shares')
    shared_with_group = models.ForeignKey('auth.Group', on_delete=models.CASCADE, null=True, blank=True)  # Django's built-in Group model
    permission_codes = models.JSONField(default=list, blank=True)  # Array of permission codes (e.g., ['view', 'change', 'delete_document'])
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)  # For revoking shares without deleting the record
    
    def clean(self):
        # Ensure either document or folder is set, not both
        if not (self.document or self.folder):
            raise ValidationError("Either document or folder must be set.")
        if self.document and self.folder:
            raise ValidationError("Only one of document or folder can be set.")
        
        # Ensure either shared_with_user or shared_with_group is set, not both
        if not (self.shared_with_user or self.shared_with_group):
            raise ValidationError("Either shared_with_user or shared_with_group must be set.")
        if self.shared_with_user and self.shared_with_group:
            raise ValidationError("Only one of shared_with_user or shared_with_group can be set.")
    
    def __str__(self):
        item = self.document or self.folder
        recipient = self.shared_with_user or self.shared_with_group
        return f"{item} shared by {self.shared_by} with {recipient}"

class Notification(models.Model):
    """Model representing a notification for a user."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    link_to_item = models.TextField(blank=True, null=True)  # URL path to the relevant item
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Notification for {self.user.username}: {self.message[:50]}..."

class AuditLog(models.Model):
    """Model representing an audit log entry."""
    
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=255)  # e.g., "DOCUMENT_UPLOADED", "USER_LOGIN_SUCCESS"
    object_type = models.CharField(max_length=100)  # e.g., "Document", "Folder", "User"
    object_id = models.BigIntegerField(null=True, blank=True)  # ID of the object affected
    details = models.JSONField(null=True, blank=True)  # JSON field for additional context
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    is_sensitive = models.BooleanField(default=False)  # Flag for security-critical events
    
    def __str__(self):
        user_str = self.user.username if self.user else "System"
        return f"{user_str} {self.action} on {self.object_type} at {self.timestamp}"