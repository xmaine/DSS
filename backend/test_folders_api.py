import os
import django
import json
import requests

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Test the folders API endpoint
def test_folders_api():
    # First, login to get session cookies
    login_url = 'http://127.0.0.1:8000/api/auth/login/'
    login_data = {
        'username': 'emponly',
        'password': 'testing'
    }
    
    session = requests.Session()
    login_response = session.post(login_url, json=login_data)
    
    print("Login Response Status:", login_response.status_code)
    print("Login Response Data:", login_response.json())
    
    if login_response.status_code == 200:
        # Now test the folders endpoint
        folders_url = 'http://127.0.0.1:8000/api/folders/'
        folders_response = session.get(folders_url)
        
        print("\nFolders Response Status:", folders_response.status_code)
        if folders_response.status_code == 200:
            print("Folders Response Data:", json.dumps(folders_response.json(), indent=2))
        else:
            print("Folders Response Error:", folders_response.text)
    else:
        print("Login failed")

if __name__ == '__main__':
    test_folders_api()