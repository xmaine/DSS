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

print("=== TESTING SYSTEM ADMINISTRATOR API ENDPOINTS ===\n")

# Test login
print("1. Testing login...")
response = session.post(login_url, json=login_data)
print(f"   Login response status: {response.status_code}")
if response.status_code == 200:
    print("   ✓ Login successful")
    print(f"   User data: {response.json()}")
else:
    print("   ✗ Login failed")
    print(f"   Error: {response.text}")
    exit()

# Test dashboard endpoint
print("\n2. Testing admin dashboard...")
dashboard_url = 'http://127.0.0.1:8000/api/admin/dashboard/'
response = session.get(dashboard_url)
print(f"   Dashboard response status: {response.status_code}")
if response.status_code == 200:
    print("   ✓ Dashboard endpoint working")
    print(f"   Dashboard data keys: {list(response.json().keys())}")
else:
    print("   ✗ Dashboard endpoint failed")
    print(f"   Error: {response.text}")

# Test users endpoint
print("\n3. Testing admin users...")
users_url = 'http://127.0.0.1:8000/api/admin/users/'
response = session.get(users_url)
print(f"   Users response status: {response.status_code}")
if response.status_code == 200:
    print("   ✓ Users endpoint working")
    users_data = response.json()
    print(f"   Number of users: {len(users_data) if isinstance(users_data, list) else 'N/A'}")
else:
    print("   ✗ Users endpoint failed")
    print(f"   Error: {response.text}")

# Test document types endpoint
print("\n4. Testing document types...")
doc_types_url = 'http://127.0.0.1:8000/api/admin/types/document-types/'
response = session.get(doc_types_url)
print(f"   Document types response status: {response.status_code}")
if response.status_code == 200:
    print("   ✓ Document types endpoint working")
    doc_types_data = response.json()
    print(f"   Number of document types: {len(doc_types_data) if isinstance(doc_types_data, list) else 'N/A'}")
else:
    print("   ✗ Document types endpoint failed")
    print(f"   Error: {response.text}")

# Test correspondents endpoint
print("\n5. Testing correspondents...")
correspondents_url = 'http://127.0.0.1:8000/api/admin/types/correspondents/'
response = session.get(correspondents_url)
print(f"   Correspondents response status: {response.status_code}")
if response.status_code == 200:
    print("   ✓ Correspondents endpoint working")
    correspondents_data = response.json()
    print(f"   Number of correspondents: {len(correspondents_data) if isinstance(correspondents_data, list) else 'N/A'}")
else:
    print("   ✗ Correspondents endpoint failed")
    print(f"   Error: {response.text}")

print("\n=== TEST COMPLETE ===")