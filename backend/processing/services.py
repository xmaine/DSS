import os
import tempfile
from django.conf import settings
from PIL import Image
import pytesseract
from pdf2image import convert_from_path
from documents.models import Document, DocumentType, Correspondent
from typing import Optional

class OCRService:
    """Service to handle OCR processing of documents."""
    
    def process_document(self, document_id: int) -> bool:
        """
        Process a document with OCR and extract text content.
        
        Args:
            document_id (int): The ID of the document to process.
            
        Returns:
            bool: True if processing was successful, False otherwise.
        """
        try:
            document = Document.objects.get(id=document_id)
            document.ocr_status = 'processing'
            document.save()
            
            # Get file path
            file_path: str = document.file.path
            
            # Extract text based on file type
            text: str = ""
            if file_path.lower().endswith('.pdf'):
                text = self._extract_text_from_pdf(file_path)
            else:
                text = self._extract_text_from_image(file_path)
            
            # Save extracted text
            document.content = text
            document.processed = True
            document.ocr_status = 'completed'
            document.save()
            
            # Convert to PDF/A if needed
            self._convert_to_pdfa(document)
            
            return True
        except Exception as e:
            document.ocr_status = 'failed'
            document.save()
            print(f"OCR processing failed for document {document_id}: {str(e)}")
            return False
    
    def _extract_text_from_pdf(self, file_path: str) -> str:
        """
        Extract text from PDF using OCR.
        
        Args:
            file_path (str): The path to the PDF file.
            
        Returns:
            str: Extracted text from the PDF.
        """
        text: str = ""
        try:
            # Convert PDF to images
            pages = convert_from_path(file_path, dpi=200)
            
            # Process each page
            for page in pages:
                page_text: str = pytesseract.image_to_string(page)
                text += page_text + "\n\n"
        except Exception as e:
            print(f"Error processing PDF: {str(e)}")
        
        return text
    
    def _extract_text_from_image(self, file_path: str) -> str:
        """
        Extract text from image using OCR.
        
        Args:
            file_path (str): The path to the image file.
            
        Returns:
            str: Extracted text from the image.
        """
        try:
            image = Image.open(file_path)
            text: str = pytesseract.image_to_string(image)
            return text
        except Exception as e:
            print(f"Error processing image: {str(e)}")
            return ""
    
    def _convert_to_pdfa(self, document: Document) -> bool:
        """
        Convert document to PDF/A format for archival.
        
        Args:
            document (Document): The document to convert.
            
        Returns:
            bool: True if conversion was successful, False otherwise.
        """
        # This is a placeholder implementation
        # In a real system, you would use a library like PyPDF2 or Ghostscript
        # to convert the document to PDF/A format
        try:
            # For now, we'll just set the archived_file to the original file
            # In a real implementation, you would convert it to PDF/A
            document.archived_file = document.file
            document.save()
            return True
        except Exception as e:
            print(f"Error converting document {document.id} to PDF/A: {str(e)}")
            return False

class DocumentClassificationService:
    """Service to handle automatic classification of documents."""
    
    def classify_document(self, document_id: int) -> bool:
        """
        Automatically classify document based on content.
        
        Args:
            document_id (int): The ID of the document to classify.
            
        Returns:
            bool: True if classification was successful, False otherwise.
        """
        try:
            document = Document.objects.get(id=document_id)
            
            # This is a simplified implementation
            # In a real system, you would use ML models for classification
            
            # Simple keyword-based classification for demo
            content: str = document.content.lower()
            
            # Set document type based on keywords
            if 'invoice' in content or 'bill' in content:
                # Try to find or create "Invoice" document type
                doc_type, created = DocumentType.objects.get_or_create(
                    name='Invoice',
                    defaults={'name': 'Invoice'}
                )
                document.document_type = doc_type
            
            elif 'contract' in content or 'agreement' in content:
                # Try to find or create "Contract" document type
                doc_type, created = DocumentType.objects.get_or_create(
                    name='Contract',
                    defaults={'name': 'Contract'}
                )
                document.document_type = doc_type
            
            # Set correspondent based on email addresses in content
            # This is a simplified example
            import re
            emails = re.findall(r'[\w\.-]+@[\w\.-]+', content)
            if emails:
                correspondent, created = Correspondent.objects.get_or_create(
                    email=emails[0],
                    defaults={'name': emails[0], 'email': emails[0]}
                )
                document.correspondent = correspondent
            
            document.save()
            return True
        except Exception as e:
            print(f"Classification failed for document {document_id}: {str(e)}")
            return False