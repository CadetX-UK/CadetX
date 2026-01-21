#!/usr/bin/env python3
import requests
import json

BASE_URL = "https://hire-talent-6.preview.emergentagent.com/api"

def test_validation():
    print("Testing validation...")
    invalid_data = {"email": "invalid-email", "password": "123", "name": ""}
    response = requests.post(f"{BASE_URL}/auth/register", json=invalid_data)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 400:
        try:
            data = response.json()
            if 'error' in data:
                print(f"✅ PASS: Validation handled correctly: {data['error']}")
                return True
            else:
                print("❌ FAIL: No error message in response")
                return False
        except:
            print("❌ FAIL: Invalid JSON response")
            return False
    else:
        print(f"❌ FAIL: Expected 400, got {response.status_code}")
        return False

if __name__ == "__main__":
    test_validation()