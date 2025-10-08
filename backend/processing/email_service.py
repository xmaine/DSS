import imaplib
import email
import os
import tempfile
from django.conf import settings
from django.core.files import File
from django.utils import timezone
from documents.models import Document
from .models import EmailAccount, EmailRule
from typing import Optional

class EmailService:
    """Service to handle email processing and document ingestion."""
    
    def process_email_accounts(self) -> None:
        """
        Process all active email accounts for new documents.
        """
        email_accounts = EmailAccount.objects.filter(active=True)
        
        for account in email_accounts:
            try:
                self._process_account(account)
                account.last_checked = timezone.now()
                account.save()
            except Exception as e:
                print(f"Error processing email account {account.email_address}: {str(e)}")
    
    def _process_account(self, account: EmailAccount) -> None:
        """
        Process a single email account.
        
        Args:
            account (EmailAccount): The email account to process.
        """
        # Connect to the email server
        mail = imaplib.IMAP4_SSL(account.imap_server, account.imap_port)
        mail.login(account.username, account.password)
        mail.select('inbox')
        
        # Search for unread emails
        status, messages = mail.search(None, 'UNSEEN')
        if status != 'OK':
            return
        
        email_ids = messages[0].split()
        
        for email_id in email_ids:
            try:
                # Fetch the email
                status, msg_data = mail.fetch(email_id, '(RFC822)')
                if status != 'OK':
                    continue
                
                # Parse the email
                msg = email.message_from_bytes(msg_data[0][1])
                
                # Process attachments
                self._process_email_attachments(account, msg)
                
                # Apply email rules
                self._apply_email_rules(account, msg, email_id)
                
            except Exception as e:
                print(f"Error processing email {email_id}: {str(e)}")
        
        mail.close()
        mail.logout()
    
    def _process_email_attachments(self, account: EmailAccount, msg) -> None:
        """
        Process attachments in an email.
        
        Args:
            account (EmailAccount): The email account.
            msg: The email message.
        """
        for part in msg.walk():
            if part.get_content_maintype() == 'multipart':
                continue
            if part.get_content_subtype() != 'plain' and part.get_content_subtype() != 'html':
                # This is an attachment
                filename: Optional[str] = part.get_filename()
                if filename:
                    # Save attachment as a document
                    self._save_email_attachment(filename, part)
    
    def _save_email_attachment(self, filename: str, part) -> None:
        """
        Save an email attachment as a document.
        
        Args:
            filename (str): The filename of the attachment.
            part: The email part containing the attachment.
        """
        try:
            # Create a temporary file
            with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
                tmp_file.write(part.get_payload(decode=True))
                tmp_file_path: str = tmp_file.name
            
            # Create a Django File object
            with open(tmp_file_path, 'rb') as f:
                django_file = File(f)
                # Create document
                document = Document(
                    title=filename,
                    original_filename=filename,
                    file=django_file
                )
                document.save()
            
            # Clean up temporary file
            os.unlink(tmp_file_path)
            
        except Exception as e:
            print(f"Error saving email attachment {filename}: {str(e)}")
    
    def _apply_email_rules(self, account: EmailAccount, msg, email_id: bytes) -> None:
        """
        Apply email rules to process the email.
        
        Args:
            account (EmailAccount): The email account.
            msg: The email message.
            email_id (bytes): The email ID.
        """
        rules = EmailRule.objects.filter(email_account=account).order_by('order')
        
        for rule in rules:
            # Check if rule conditions match
            if self._rule_matches(rule, msg):
                # Apply rule action
                self._apply_rule_action(rule, email_id)
                # If rule has a stop condition, break
                # (implementation depends on your requirements)
    
    def _rule_matches(self, rule: EmailRule, msg) -> bool:
        """
        Check if an email matches a rule's conditions.
        
        Args:
            rule (EmailRule): The email rule to check.
            msg: The email message.
            
        Returns:
            bool: True if the rule matches, False otherwise.
        """
        # Check subject
        if rule.subject_contains and rule.subject_contains not in msg['Subject']:
            return False
        
        # Check sender
        if rule.sender_contains and rule.sender_contains not in msg['From']:
            return False
        
        # For body checking, we would need to extract the body text
        # This is a simplified implementation
        
        return True
    
    def _apply_rule_action(self, rule: EmailRule, email_id: bytes) -> None:
        """
        Apply a rule's action to an email.
        
        Args:
            rule (EmailRule): The email rule to apply.
            email_id (bytes): The email ID.
        """
        # Implementation depends on the action type
        # This is a simplified example
        pass