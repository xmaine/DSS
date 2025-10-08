from django.core.management.base import BaseCommand
from documents.models import Document
from processing.services import OCRService, DocumentClassificationService

class Command(BaseCommand):
    help = 'Process pending documents with OCR and classification'

    def add_arguments(self, parser):
        parser.add_argument(
            '--document-id',
            type=int,
            help='Process a specific document by ID',
        )

    def handle(self, *args, **options):
        ocr_service = OCRService()
        classification_service = DocumentClassificationService()
        
        if options['document_id']:
            # Process specific document
            try:
                document = Document.objects.get(id=options['document_id'])
                if document.ocr_status == 'pending':
                    self.stdout.write(f'Processing document {document.id}...')
                    if ocr_service.process_document(document.id):
                        self.stdout.write(
                            self.style.SUCCESS(f'Successfully processed document {document.id}')
                        )
                        # Classify the document
                        if classification_service.classify_document(document.id):
                            self.stdout.write(
                                self.style.SUCCESS(f'Successfully classified document {document.id}')
                            )
                        else:
                            self.stdout.write(
                                self.style.ERROR(f'Failed to classify document {document.id}')
                            )
                    else:
                        self.stdout.write(
                            self.style.ERROR(f'Failed to process document {document.id}')
                        )
                else:
                    self.stdout.write(f'Document {document.id} is already processed or processing')
            except Document.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'Document with ID {options["document_id"]} does not exist')
                )
        else:
            # Process all pending documents
            pending_documents = Document.objects.filter(ocr_status='pending')
            self.stdout.write(f'Found {pending_documents.count()} pending documents')
            
            for document in pending_documents:
                self.stdout.write(f'Processing document {document.id}...')
                if ocr_service.process_document(document.id):
                    self.stdout.write(
                        self.style.SUCCESS(f'Successfully processed document {document.id}')
                    )
                    # Classify the document
                    if classification_service.classify_document(document.id):
                        self.stdout.write(
                            self.style.SUCCESS(f'Successfully classified document {document.id}')
                        )
                    else:
                        self.stdout.write(
                            self.style.ERROR(f'Failed to classify document {document.id}')
                        )
                else:
                    self.stdout.write(
                        self.style.ERROR(f'Failed to process document {document.id}')
                    )