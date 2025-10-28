# Document App Views

This package contains all the Django REST Framework viewsets for the documents app, organized by functionality to improve modularity and maintainability.

## Structure

- `base_views.py` - Base viewset classes with common functionality
- `document_views.py` - ViewSet for Document model operations
- `folder_views.py` - ViewSet for Folder model operations
- `classification_views.py` - ViewSets for Tag, Correspondent, and DocumentType models
- `shared_item_views.py` - ViewSet for SharedItem model operations
- `__init__.py` - Exports all viewsets for easy importing

## Refactoring

This structure was created to comply with the QRULES.md guideline of keeping files concise (<500 lines). The original monolithic `views.py` file was over 400 lines and has been split into multiple focused files.

Each viewset now has comprehensive Google-style docstrings and follows PEP8 guidelines.