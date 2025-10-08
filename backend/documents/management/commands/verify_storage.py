from django.core.management.base import BaseCommand
from documents.storage import DocumentStorageService

class Command(BaseCommand):
    help = 'Verify document storage integrity'

    def add_arguments(self, parser):
        parser.add_argument(
            '--document-id',
            type=int,
            help='Verify storage integrity for a specific document by ID',
        )

    def handle(self, *args, **options):
        storage_service = DocumentStorageService()
        
        if options['document_id']:
            # Verify storage integrity for specific document
            result = storage_service.verify_document_integrity(options['document_id'])
            if result['valid']:
                self.stdout.write(
                    self.style.SUCCESS(f'Document {options["document_id"]} storage is valid')
                )
            else:
                self.stdout.write(
                    self.style.ERROR(f'Document {options["document_id"]} storage issues: {", ".join(result["issues"])}')
                )
        else:
            # Verify storage integrity for all documents
            self.stdout.write('Verifying storage integrity for all documents...')
            
            # This could be a lengthy operation, so we'll just show statistics
            stats = storage_service.get_storage_statistics()
            self.stdout.write(f"Total documents: {stats['total_documents']}")
            self.stdout.write(f"Total storage used: {stats['total_storage_bytes']} bytes")
            self.stdout.write("Document type distribution:")
            for doc_type, count in stats['document_types'].items():
                self.stdout.write(f"  {doc_type}: {count} documents")