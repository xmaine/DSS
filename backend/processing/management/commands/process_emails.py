from django.core.management.base import BaseCommand
from processing.email_service import EmailService

class Command(BaseCommand):
    help = 'Process email accounts for document ingestion'

    def handle(self, *args, **options):
        email_service = EmailService()
        
        self.stdout.write('Processing email accounts for document ingestion...')
        email_service.process_email_accounts()
        self.stdout.write(
            self.style.SUCCESS('Successfully processed email accounts')
        )