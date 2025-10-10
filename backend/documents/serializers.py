from rest_framework import serializers
from .models import Document, Tag, Correspondent, DocumentType, DocumentVersion, DocumentRating, Annotation, SharedItem, Notification, AuditLog, Folder

class FolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        fields = ['id', 'name', 'parent_folder', 'owner', 'created_at', 'updated_at', 'is_active', 'path']

class DocumentSerializer(serializers.ModelSerializer):
    tags = serializers.StringRelatedField(many=True, read_only=True)
    current_version_file = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = ['id', 'uuid', 'name', 'description', 'folder', 'document_type', 'correspondent', 
                  'uploader', 'current_version', 'created_at', 'updated_at', 'locked_by', 
                  'locked_at', 'is_active', 'extracted_text', 'tags', 'current_version_file']
    
    def get_current_version_file(self, obj):
        if obj.current_version:
            return obj.current_version.file.url if obj.current_version.file else None
        return None

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class CorrespondentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Correspondent
        fields = ['id', 'name', 'description']

class DocumentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentType
        fields = ['id', 'name', 'description']

class DocumentVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentVersion
        fields = ['id', 'document', 'version_number', 'file', 'file_size', 'file_type', 
                  'uploaded_by', 'created_at', 'checksum', 'comment', 'is_current']

class DocumentRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentRating
        fields = ['id', 'document', 'user', 'rating', 'created_at']

class AnnotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Annotation
        fields = ['id', 'document_version', 'user', 'content', 'page_number', 'coords', 'created_at', 'updated_at']

class SharedItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedItem
        fields = ['id', 'document', 'folder', 'shared_by', 'shared_with_user', 'shared_with_group', 
                  'permission_level', 'created_at', 'expires_at']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'link_to_item', 'is_read', 'created_at']

class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = ['id', 'timestamp', 'user', 'action', 'object_type', 'object_id', 'details', 'ip_address', 'is_sensitive']