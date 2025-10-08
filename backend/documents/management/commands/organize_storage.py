from django.core.management.base import BaseCommand
from documents.storage import DocumentStorageService

class Command(BaseCommand):
    help = 'Organize document storage according to configured rules'

    def add_arguments(self, parser):
        parser.add_argument(
            '--document-id',
            type=int,
            help='Organize storage for a specific document by ID',
        )

    def handle(self, *args, **options):
        storage_service = DocumentStorageService()
        
        if options['document_id']:
            # Organize storage for specific document
            try:
                self.stdout.write(f'Organizing storage for document {options["document_id"]}...')
                if storage_service.organize_document_storage(options['document_id']):
                    self.stdout.write(
                        self.style.SUCCESS(f'Successfully organized storage for document {options["document_id"]}')
                    )
                else:
                    self.stdout.write(
                        self.style.ERROR(f'Failed to organize storage for document {options["document_id"]}')
                    )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error organizing storage for document {options["document_id"]}: {str(e)}')
                )
        else:
            # Organize storage for all documents
            self.stdout.write('Organizing storage for all documents...')
            organized_count = storage_service.organize_all_documents()
            self.stdout.write(
                self.style.SUCCESS(f'Successfully organized storage for {organized_count} documents')
            )