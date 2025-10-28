# Import all view classes to make them available when importing from views package
from .document_views import DocumentViewSet
from .classification_views import TagViewSet, CorrespondentViewSet, DocumentTypeViewSet
from .folder_views import FolderViewSet
from .shared_item_views import SharedItemViewSet