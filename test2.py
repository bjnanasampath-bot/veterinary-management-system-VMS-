import urllib.request, urllib.error, json
req = urllib.request.Request(
    'http://localhost:8000/api/auth/register/', 
    data=json.dumps({
        'first_name': 'sampath', 
        'last_name': 'nivas', 
        'email': 'sampathnivas@gmail.com', 
        'role': 'doctor', 
        'password': 'password123', 
        'confirm_password': 'password123'
    }).encode(), 
    headers={'Content-Type': 'application/json'}
)
try:
    print(urllib.request.urlopen(req).read().decode())
except urllib.error.HTTPError as e:
    print(e.read().decode())
