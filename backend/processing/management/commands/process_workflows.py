from django.core.management.base import BaseCommand
from documents.models import Document
from processing.workflow_service import WorkflowService

class Command(BaseCommand):
    help = 'Process workflows for documents'

    def add_arguments(self, parser):
        parser.add_argument(
            '--document-id',
            type=int,
            help='Process workflows for a specific document by ID',
        )

    def handle(self, *args, **options):
        workflow_service = WorkflowService()
        
        if options['document_id']:
            # Process workflows for specific document
            try:
                document = Document.objects.get(id=options['document_id'])
                self.stdout.write(f'Processing workflows for document {document.id}...')
                workflow_service.process_workflows(document.id)
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully processed workflows for document {document.id}')
                )
            except Document.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'Document with ID {options["document_id"]} does not exist')
                )
        else:
            # Process workflows for all documents
            documents = Document.objects.all()
            self.stdout.write(f'Processing workflows for {documents.count()} documents')
            
            for document in documents:
                self.stdout.write(f'Processing workflows for document {document.id}...')
                workflow_service.process_workflows(document.id)
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully processed workflows for document {document.id}')
                )