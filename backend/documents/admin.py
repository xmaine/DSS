from django.contrib import admin
from .models import Folder, DocumentType, Correspondent, Tag, Document, DocumentVersion, DocumentRating, Annotation, SharedItem, Notification, AuditLog

@admin.register(Folder)
class FolderAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'created_at', 'is_active')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name',)

@admin.register(DocumentType)
class DocumentTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Correspondent)
class CorrespondentAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'uploader', 'created_at', 'is_active')  # Changed from 'name' to 'title'
    list_filter = ('is_active', 'created_at', 'document_type')
    search_fields = ('title', 'description')  # Changed from 'name' to 'title'

@admin.register(DocumentVersion)
class DocumentVersionAdmin(admin.ModelAdmin):
    list_display = ('document', 'version_number', 'uploaded_by', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('document__title',)  # Changed from 'name' to 'title'

@admin.register(DocumentRating)
class DocumentRatingAdmin(admin.ModelAdmin):
    list_display = ('document', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')

@admin.register(Annotation)
class AnnotationAdmin(admin.ModelAdmin):
    list_display = ('document_version', 'user', 'created_at')
    list_filter = ('created_at',)

@admin.register(SharedItem)
class SharedItemAdmin(admin.ModelAdmin):
    list_display = ('shared_by', 'created_at', 'is_active')
    list_filter = ('is_active', 'created_at')

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'object_type', 'timestamp', 'is_sensitive')
    list_filter = ('action', 'object_type', 'is_sensitive', 'timestamp')
    search_fields = ('action', 'object_type')