import requests
import json

# Create a session to maintain cookies
session = requests.Session()

# Login
login_url = 'http://127.0.0.1:8000/api/auth/login/'
login_data = {
    'username': 'sysadmins',
    'password': 'maineroot'
}

response = session.post(login_url, json=login_data)
print("Login response:", response.status_code)
print("Login data:", response.json())

# Access admin dashboard
dashboard_url = 'http://127.0.0.1:8000/api/admin/dashboard/'
response = session.get(dashboard_url)
print("\nDashboard response:", response.status_code)
if response.status_code == 200:
    print("Dashboard data:", json.dumps(response.json(), indent=2))
else:
    print("Error:", response.json())

# Access folder tree
folder_tree_url = 'http://127.0.0.1:8000/api/admin/documents/folder-tree/'
response = session.get(folder_tree_url)
print("\nFolder tree response:", response.status_code)
if response.status_code == 200:
    print("Folder tree data:", json.dumps(response.json(), indent=2))
else:
    print("Error:", response.json())

# Access users list
users_url = 'http://127.0.0.1:8000/api/admin/users/'
response = session.get(users_url)
print("\nUsers list response:", response.status_code)
if response.status_code == 200:
    print("Users list data:", json.dumps(response.json(), indent=2))
else:
    print("Error:", response.json())

# Search users
search_users_url = 'http://127.0.0.1:8000/api/admin/users/search/?q=sysadmin'
response = session.get(search_users_url)
print("\nSearch users response:", response.status_code)
if response.status_code == 200:
    print("Search users data:", json.dumps(response.json(), indent=2))
else:
    print("Error:", response.json())

# Access document types
doc_types_url = 'http://127.0.0.1:8000/api/admin/types/document-types/'
response = session.get(doc_types_url)
print("\nDocument types response:", response.status_code)
if response.status_code == 200:
    print("Document types data:", json.dumps(response.json(), indent=2))
else:
    print("Error:", response.json())

# Access correspondents
correspondents_url = 'http://127.0.0.1:8000/api/admin/types/correspondents/'
response = session.get(correspondents_url)
print("\nCorrespondents response:", response.status_code)
if response.status_code == 200:
    print("Correspondents data:", json.dumps(response.json(), indent=2))
else:
    print("Error:", response.json())

# Access global role permissions
global_permissions_url = 'http://127.0.0.1:8000/api/admin/permissions/global-role-permissions/'
response = session.get(global_permissions_url)
print("\nGlobal role permissions response:", response.status_code)
if response.status_code == 200:
    print("Global role permissions data:", json.dumps(response.json(), indent=2))
else:
    print("Error:", response.json())

# Access workflows
workflows_url = 'http://127.0.0.1:8000/api/admin/workflows/'
response = session.get(workflows_url)
print("\nWorkflows response:", response.status_code)
if response.status_code == 200:
    print("Workflows data:", json.dumps(response.json(), indent=2))
else:
    print("Error:", response.json())

# Access audit logs
audit_logs_url = 'http://127.0.0.1:8000/api/admin/audit-logs/'
response = session.get(audit_logs_url)
print("\nAudit logs response:", response.status_code)
if response.status_code == 200:
    print("Audit logs data:", json.dumps(response.json(), indent=2))
else:
    print("Error:", response.json())

# Access system configuration settings
storage_settings_url = 'http://127.0.0.1:8000/api/admin/config/storage-settings/'
response = session.get(storage_settings_url)
print("\nStorage settings response:", response.status_code)
if response.status_code == 200:
    print("Storage settings data:", json.dumps(response.json(), indent=2))
else:
    print("Error:", response.json())