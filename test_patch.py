import requests

url = "http://127.0.0.1:8000/api/auth/login/"
res = requests.post(url, json={"email":"admin@example.com", "password":"admin"})
token = res.json().get('data', {}).get('access')

headers = {"Authorization": f"Bearer {token}"}

# get items
items = requests.get("http://127.0.0.1:8000/api/pharmacy/items/", headers=headers).json()
print("Items:", items)

if items['data']['results']:
    item_id = items['data']['results'][0]['id']
    print("Patching item", item_id)
    patch_res = requests.patch(f"http://127.0.0.1:8000/api/pharmacy/items/{item_id}/", headers=headers, json={"stock_quantity": 100})
    print("Status:", patch_res.status_code)
    print("Response:", patch_res.json())
