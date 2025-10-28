# Document Management Views
# This file has been refactored to improve modularity and maintainability
# Individual viewsets have been moved to separate files in the views package

from .views.document_views import DocumentViewSet
from .views.classification_views import TagViewSet, CorrespondentViewSet, DocumentTypeViewSet
from .views.folder_views import FolderViewSet
from .views.shared_item_views import SharedItemViewSet