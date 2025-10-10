import requests
import json

# Create a session to maintain cookies
session = requests.Session()

# Login as System Administrator
login_url = 'http://127.0.0.1:8000/api/auth/login/'
login_data = {
    'username': 'sysadmins',
    'password': 'maineroot'
}

print("=== DETAILED SYSTEM ADMINISTRATOR FUNCTIONS TEST ===\n")

response = session.post(login_url, json=login_data)
print("1. Login response:", response.status_code)
if response.status_code == 200:
    print("   ✓ Login successful")
else:
    print("   ✗ Login failed")
    exit()

# Test specific endpoints with detailed output
endpoints = [
    # Dashboard
    ('GET', 'Dashboard', 'http://127.0.0.1:8000/api/admin/dashboard/'),
    
    # Users management
    ('GET', 'User List', 'http://127.0.0.1:8000/api/admin/users/'),
    
    # Types management
    ('GET', 'Document Types', 'http://127.0.0.1:8000/api/admin/types/document-types/'),
    ('GET', 'Correspondents', 'http://127.0.0.1:8000/api/admin/types/correspondents/'),
    
    # Permissions management
    ('GET', 'Global Role Permissions', 'http://127.0.0.1:8000/api/admin/permissions/global-role-permissions/'),
    
    # Workflows management
    ('GET', 'Workflow List', 'http://127.0.0.1:8000/api/admin/workflows/'),
    
    # Logs
    ('GET', 'Audit Logs', 'http://127.0.0.1:8000/api/admin/audit-logs/'),
    
    # Configuration
    ('GET', 'Storage Settings', 'http://127.0.0.1:8000/api/admin/config/storage-settings/'),
]

print("\n=== DETAILED ENDPOINT DATA ===\n")

for method, name, url in endpoints:
    try:
        if method == 'GET':
            response = session.get(url)
        elif method == 'POST':
            response = session.post(url)
        
        print(f"=== {name} ===")
        print(f"URL: {url}")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print(f"Data type: List with {len(data)} items")
                if len(data) > 0:
                    print("First item:")
                    print(json.dumps(data[0], indent=2, default=str))
                else:
                    print("List is empty")
            elif isinstance(data, dict):
                print(f"Data type: Dictionary with {len(data)} keys")
                print("Content:")
                print(json.dumps(data, indent=2, default=str))
            else:
                print(f"Data type: {type(data)}")
                print(f"Content: {data}")
        else:
            print(f"Error: {response.text}")
        print("\n" + "-"*50 + "\n")
        
    except Exception as e:
        print(f"Exception: {str(e)}")
        print("\n" + "-"*50 + "\n")