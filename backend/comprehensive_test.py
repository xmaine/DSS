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

print("=== TESTING SYSTEM ADMINISTRATOR FUNCTIONS ===\n")

response = session.post(login_url, json=login_data)
print("1. Login response:", response.status_code)
if response.status_code == 200:
    print("   ✓ Login successful")
else:
    print("   ✗ Login failed")
    exit()

# Test all System Administrator endpoints
endpoints = [
    # Dashboard
    ('GET', 'Dashboard', 'http://127.0.0.1:8000/api/admin/dashboard/'),
    
    # Files management
    ('GET', 'Folder Tree', 'http://127.0.0.1:8000/api/admin/documents/folder-tree/'),
    ('GET', 'Document List', 'http://127.0.0.1:8000/api/documents/'),
    
    # Users management
    ('GET', 'User List', 'http://127.0.0.1:8000/api/admin/users/'),
    ('GET', 'Search Users', 'http://127.0.0.1:8000/api/admin/users/search/?q=sysadmin'),
    
    # Types management
    ('GET', 'Document Types', 'http://127.0.0.1:8000/api/admin/types/document-types/'),
    ('GET', 'Correspondents', 'http://127.0.0.1:8000/api/admin/types/correspondents/'),
    
    # Permissions management
    ('GET', 'Global Role Permissions', 'http://127.0.0.1:8000/api/admin/permissions/global-role-permissions/'),
    ('GET', 'Object Level Permissions', 'http://127.0.0.1:8000/api/admin/permissions/object-level-permissions/'),
    
    # Workflows management
    ('GET', 'Workflow List', 'http://127.0.0.1:8000/api/admin/workflows/'),
    ('GET', 'Active Workflows', 'http://127.0.0.1:8000/api/admin/workflows/active-workflows/'),
    
    # Logs
    ('GET', 'Audit Logs', 'http://127.0.0.1:8000/api/admin/audit-logs/'),
    
    # Configuration
    ('GET', 'Storage Settings', 'http://127.0.0.1:8000/api/admin/config/storage-settings/'),
    ('GET', 'OCR Settings', 'http://127.0.0.1:8000/api/admin/config/ocr-settings/'),
    ('GET', 'Email Settings', 'http://127.0.0.1:8000/api/admin/config/email-settings/'),
    ('GET', 'Security Policies', 'http://127.0.0.1:8000/api/admin/config/security-policies/'),
    ('GET', 'Integration Settings', 'http://127.0.0.1:8000/api/admin/config/integration-settings/'),
]

print("\n=== TESTING ENDPOINTS ===\n")

working_endpoints = []
failing_endpoints = []

for method, name, url in endpoints:
    try:
        if method == 'GET':
            response = session.get(url)
        elif method == 'POST':
            response = session.post(url)
        
        print(f"{name} ({method} {url}): {response.status_code}")
        if response.status_code == 200:
            print(f"   ✓ Working - Data: {len(response.json()) if isinstance(response.json(), (list, dict)) else 'N/A'} items")
            working_endpoints.append((name, url))
        else:
            print(f"   ✗ Failed - Error: {response.text[:100]}")
            failing_endpoints.append((name, url, response.status_code, response.text[:100]))
    except Exception as e:
        print(f"   ✗ Exception - Error: {str(e)[:100]}")
        failing_endpoints.append((name, url, "Exception", str(e)[:100]))

print(f"\n=== SUMMARY ===")
print(f"Working endpoints: {len(working_endpoints)}")
print(f"Failing endpoints: {len(failing_endpoints)}")

if failing_endpoints:
    print("\n=== FAILING ENDPOINTS ===")
    for name, url, status, error in failing_endpoints:
        print(f"  {name}: {status} - {error}")

print("\n=== WORKING ENDPOINTS ===")
for name, url in working_endpoints:
    print(f"  {name}: {url}")