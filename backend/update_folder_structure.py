import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from documents.models import Folder
from users.models import CustomUser

def update_folder_structure():
    """Update folder structure to match requirements"""
    print("Updating folder structure...")
    
    try:
        # Get the Publication Documents folder
        pub_folder = Folder.objects.get(name='Publication Documents')
        print(f"Found Publication Documents folder: {pub_folder.name}")
        
        # Update emponly's Documents folder to be under Publication Documents
        emponly_folder = Folder.objects.get(name="emponly's Documents")
        emponly_folder.parent_folder = pub_folder
        emponly_folder.path = '/Publication Documents/emponly\'s Documents'
        emponly_folder.save()
        print(f"Updated {emponly_folder.name} to be under {pub_folder.name}")
        
        # Display the updated folder structure
        print("\n=== Updated Folder Structure ===")
        folders = Folder.objects.all()
        for folder in folders:
            parent_name = folder.parent_folder.name if folder.parent_folder else "None"
            print(f"{folder.name} - Owner: {folder.owner.username} - Parent: {parent_name}")
            
    except Folder.DoesNotExist as e:
        print(f"Folder not found: {e}")
    except Exception as e:
        print(f"Error updating folder structure: {e}")

def verify_documents():
    """Verify that documents have correct uploader information"""
    print("\n=== Verifying Document Uploaders ===")
    from documents.models import Document
    
    documents = Document.objects.all()
    for doc in documents:
        print(f"{doc.name} - Uploaded by: {doc.uploader.username} ({doc.uploader.get_full_name()})")
        
    print(f"\nTotal documents: {len(documents)}")

if __name__ == "__main__":
    update_folder_structure()
    verify_documents()