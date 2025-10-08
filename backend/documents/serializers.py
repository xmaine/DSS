from rest_framework import serializers
from .models import Document, Tag, Correspondent, DocumentType, DocumentPermission, SharedLink

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'color', 'created_at']

class CorrespondentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Correspondent
        fields = ['id', 'name', 'email', 'created_at']

class DocumentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentType
        fields = ['id', 'name', 'created_at']

class DocumentPermissionSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    
    class Meta:
        model = DocumentPermission
        fields = ['id', 'document', 'user', 'permission_level', 'created_at']

class SharedLinkSerializer(serializers.ModelSerializer):
    document = serializers.StringRelatedField()
    created_by = serializers.StringRelatedField()
    
    class Meta:
        model = SharedLink
        fields = ['id', 'document', 'token', 'created_by', 'created_at', 'expires_at', 'is_active']

class DocumentSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    correspondent = CorrespondentSerializer(read_only=True)
    document_type = DocumentTypeSerializer(read_only=True)
    
    class Meta:
        model = Document
        fields = [
            'id', 'title', 'description', 'file', 'archived_file',
            'uploaded_at', 'updated_at', 'content', 'processed',
            'ocr_status', 'original_filename', 'file_size', 'mime_type',
            'tags', 'correspondent', 'document_type', 'archived'
        ]
        read_only_fields = ['uploaded_at', 'updated_at', 'content', 'processed', 'ocr_status']