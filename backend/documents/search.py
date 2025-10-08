from django.db.models import Q, QuerySet
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from .models import Document, Tag, Correspondent, DocumentType
from typing import Dict, List, Optional, Union

class DocumentSearchService:
    """Service to handle document search and discovery."""
    
    def search_documents(self, query: str, filters: Optional[Dict[str, Union[str, List[str]]]] = None) -> QuerySet[Document]:
        """
        Search documents based on query and filters.
        
        Args:
            query (str): The search query string.
            filters (dict, optional): Dictionary of filters to apply. Defaults to None.
            
        Returns:
            QuerySet: Filtered documents matching the search criteria.
        """
        # Start with all documents
        documents: QuerySet[Document] = Document.objects.all()
        
        # Apply text search if query provided
        if query:
            # Use PostgreSQL full-text search
            search_vector = SearchVector('title', weight='A') + \
                           SearchVector('content', weight='B') + \
                           SearchVector('description', weight='C')
            search_query = SearchQuery(query)
            documents = documents.annotate(
                search=search_vector,
                rank=SearchRank(search_vector, search_query)
            ).filter(search=search_query).order_by('-rank')
        
        # Apply filters if provided
        if filters:
            documents = self._apply_filters(documents, filters)
        
        return documents
    
    def _apply_filters(self, documents: QuerySet[Document], filters: Dict[str, Union[str, List[str]]]) -> QuerySet[Document]:
        """
        Apply filters to document queryset.
        
        Args:
            documents (QuerySet): The documents queryset to filter.
            filters (dict): Dictionary of filters to apply.
            
        Returns:
            QuerySet: Filtered documents.
        """
        # Filter by tags
        if 'tags' in filters and filters['tags']:
            documents = documents.filter(tags__in=filters['tags'])
        
        # Filter by correspondent
        if 'correspondent' in filters and filters['correspondent']:
            documents = documents.filter(correspondent=filters['correspondent'])
        
        # Filter by document type
        if 'document_type' in filters and filters['document_type']:
            documents = documents.filter(document_type=filters['document_type'])
        
        # Filter by date range
        if 'date_from' in filters and filters['date_from']:
            documents = documents.filter(uploaded_at__gte=filters['date_from'])
        
        if 'date_to' in filters and filters['date_to']:
            documents = documents.filter(uploaded_at__lte=filters['date_to'])
        
        return documents
    
    def get_search_suggestions(self, partial_query: str) -> List[str]:
        """
        Get search suggestions based on partial query.
        
        Args:
            partial_query (str): The partial query string.
            
        Returns:
            list: List of suggestion strings.
        """
        # Get suggestions from document titles
        title_suggestions = Document.objects.filter(
            title__icontains=partial_query
        ).values_list('title', flat=True).distinct()[:10]
        
        # Get suggestions from tags
        tag_suggestions = Tag.objects.filter(
            name__icontains=partial_query
        ).values_list('name', flat=True).distinct()[:10]
        
        # Get suggestions from correspondents
        correspondent_suggestions = Correspondent.objects.filter(
            name__icontains=partial_query
        ).values_list('name', flat=True).distinct()[:10]
        
        # Combine and deduplicate suggestions
        all_suggestions: List[str] = list(set(
            list(title_suggestions) + 
            list(tag_suggestions) + 
            list(correspondent_suggestions)
        ))[:20]
        
        return all_suggestions
    
    def find_similar_documents(self, document_id: int, limit: int = 5) -> QuerySet[Document]:
        """
        Find documents similar to the given document.
        
        Args:
            document_id (int): The ID of the document to find similar documents for.
            limit (int, optional): Maximum number of similar documents to return. Defaults to 5.
            
        Returns:
            QuerySet: Similar documents or empty queryset if document not found.
        """
        try:
            document = Document.objects.get(id=document_id)
            
            # For simplicity, we'll find documents with similar tags
            # In a real implementation, you might use content similarity algorithms
            if document.tags.exists():
                similar_documents = Document.objects.filter(
                    tags__in=document.tags.all()
                ).exclude(id=document_id).distinct()[:limit]
                return similar_documents
            
            # If no tags, find documents with similar document type
            if document.document_type:
                similar_documents = Document.objects.filter(
                    document_type=document.document_type
                ).exclude(id=document_id)[:limit]
                return similar_documents
            
            # If no tags or document type, return recent documents
            similar_documents = Document.objects.exclude(
                id=document_id
            ).order_by('-uploaded_at')[:limit]
            return similar_documents
            
        except Document.DoesNotExist:
            return Document.objects.none()