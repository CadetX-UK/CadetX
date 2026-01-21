#!/usr/bin/env python3
"""
CadetX Backend API Testing Suite
Tests all backend APIs according to test_result.md priorities
"""

import requests
import json
import time
import uuid
from datetime import datetime

# Configuration
BASE_URL = "https://hire-talent-6.preview.emergentagent.com/api"
TIMEOUT = 30

# Generate unique test data for each run
test_id = str(uuid.uuid4())[:8]

# Test data
TEST_STUDENT_DATA = {
    "email": f"student_{test_id}@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "student"
}

TEST_COMPANY_DATA = {
    "email": f"company_{test_id}@techcorp.com", 
    "password": "password123",
    "name": "Tech Corp",
    "role": "company"
}

ADMIN_CREDENTIALS = {
    "email": "k641259@gmail.com",
    "password": "CADETX"
}

# Global variables to store tokens
student_token = None
company_token = None
admin_token = None
student_id = None

def log_test(test_name, status, details=""):
    """Log test results"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    status_symbol = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
    print(f"[{timestamp}] {status_symbol} {test_name}")
    if details:
        print(f"    {details}")
    print()

def make_request(method, endpoint, data=None, headers=None, expected_status=None):
    """Make HTTP request with error handling"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method.upper() == 'GET':
            response = requests.get(url, headers=headers, timeout=TIMEOUT)
        elif method.upper() == 'POST':
            response = requests.post(url, json=data, headers=headers, timeout=TIMEOUT)
        elif method.upper() == 'PATCH':
            response = requests.patch(url, json=data, headers=headers, timeout=TIMEOUT)
        else:
            raise ValueError(f"Unsupported method: {method}")
            
        # Check if response is successful
        if expected_status and response.status_code != expected_status:
            return None, f"Expected status {expected_status}, got {response.status_code}: {response.text}"
            
        return response, None
        
    except requests.exceptions.Timeout:
        return None, "Request timeout"
    except requests.exceptions.ConnectionError:
        return None, "Connection error"
    except Exception as e:
        return None, f"Request error: {str(e)}"

def test_health_check():
    """Test API health endpoint"""
    response, error = make_request('GET', '/health', expected_status=200)
    
    if error:
        log_test("Health Check", "FAIL", error)
        return False
        
    try:
        data = response.json()
        if data.get('status') == 'ok':
            log_test("Health Check", "PASS", "API is healthy")
            return True
        else:
            log_test("Health Check", "FAIL", f"Unexpected response: {data}")
            return False
    except:
        log_test("Health Check", "FAIL", "Invalid JSON response")
        return False

def test_seed_data():
    """Create seed data for testing"""
    response, error = make_request('POST', '/seed', expected_status=200)
    
    if error:
        log_test("Seed Data Creation", "FAIL", error)
        return False
        
    try:
        data = response.json()
        if data.get('success'):
            log_test("Seed Data Creation", "PASS", "Sample materials created")
            return True
        else:
            log_test("Seed Data Creation", "FAIL", f"Unexpected response: {data}")
            return False
    except:
        log_test("Seed Data Creation", "FAIL", "Invalid JSON response")
        return False

def test_user_registration():
    """Test user registration API"""
    global student_id
    
    # Test valid student registration
    response, error = make_request('POST', '/auth/register', TEST_STUDENT_DATA, expected_status=200)
    
    if error:
        log_test("User Registration API - Valid Student", "FAIL", error)
        return False
        
    try:
        data = response.json()
        if data.get('token') and data.get('user'):
            global student_token
            student_token = data['token']
            student_id = data['user']['id']
            log_test("User Registration API - Valid Student", "PASS", f"Token received, User ID: {student_id}")
        else:
            log_test("User Registration API - Valid Student", "FAIL", f"Missing token or user: {data}")
            return False
    except:
        log_test("User Registration API - Valid Student", "FAIL", "Invalid JSON response")
        return False
    
    # Test company registration
    response, error = make_request('POST', '/auth/register', TEST_COMPANY_DATA, expected_status=200)
    
    if error:
        log_test("User Registration API - Valid Company", "FAIL", error)
        return False
        
    try:
        data = response.json()
        if data.get('token') and data.get('user'):
            global company_token
            company_token = data['token']
            log_test("User Registration API - Valid Company", "PASS", "Company registered successfully")
        else:
            log_test("User Registration API - Valid Company", "FAIL", f"Missing token or user: {data}")
            return False
    except:
        log_test("User Registration API - Valid Company", "FAIL", "Invalid JSON response")
        return False
    
    # Test validation errors
    invalid_data = {"email": "invalid-email", "password": "123", "name": ""}
    response, error = make_request('POST', '/auth/register', invalid_data)
    
    if error:
        log_test("User Registration API - Validation", "FAIL", error)
        return False
    elif response and response.status_code == 400:
        try:
            data = response.json()
            if 'error' in data:
                log_test("User Registration API - Validation", "PASS", f"Validation errors handled correctly: {data['error']}")
            else:
                log_test("User Registration API - Validation", "FAIL", "No error message in response")
                return False
        except:
            log_test("User Registration API - Validation", "FAIL", "Invalid JSON response")
            return False
    else:
        log_test("User Registration API - Validation", "FAIL", f"Expected 400, got {response.status_code}")
        return False
    
    # Test duplicate email
    response, error = make_request('POST', '/auth/register', TEST_STUDENT_DATA)
    
    if error:
        log_test("User Registration API - Duplicate Email", "FAIL", error)
        return False
    elif response and response.status_code == 400:
        try:
            data = response.json()
            if 'error' in data:
                log_test("User Registration API - Duplicate Email", "PASS", f"Duplicate email handled correctly: {data['error']}")
            else:
                log_test("User Registration API - Duplicate Email", "FAIL", "No error message in response")
                return False
        except:
            log_test("User Registration API - Duplicate Email", "FAIL", "Invalid JSON response")
            return False
    else:
        log_test("User Registration API - Duplicate Email", "FAIL", f"Expected 400, got {response.status_code}")
        return False
    
    return True

def test_user_login():
    """Test user login API"""
    # Test valid login
    login_data = {"email": TEST_STUDENT_DATA["email"], "password": TEST_STUDENT_DATA["password"]}
    response, error = make_request('POST', '/auth/login', login_data, expected_status=200)
    
    if error:
        log_test("User Login API - Valid Credentials", "FAIL", error)
        return False
        
    try:
        data = response.json()
        if data.get('token') and data.get('user'):
            log_test("User Login API - Valid Credentials", "PASS", "Login successful")
        else:
            log_test("User Login API - Valid Credentials", "FAIL", f"Missing token or user: {data}")
            return False
    except:
        log_test("User Login API - Valid Credentials", "FAIL", "Invalid JSON response")
        return False
    
    # Test invalid credentials
    invalid_login = {"email": TEST_STUDENT_DATA["email"], "password": "wrongpassword"}
    response, error = make_request('POST', '/auth/login', invalid_login)
    
    if error:
        log_test("User Login API - Invalid Credentials", "FAIL", error)
        return False
    elif response and response.status_code == 401:
        try:
            data = response.json()
            if 'error' in data:
                log_test("User Login API - Invalid Credentials", "PASS", f"Invalid credentials handled correctly: {data['error']}")
                return True
            else:
                log_test("User Login API - Invalid Credentials", "FAIL", "No error message in response")
                return False
        except:
            log_test("User Login API - Invalid Credentials", "FAIL", "Invalid JSON response")
            return False
    else:
        log_test("User Login API - Invalid Credentials", "FAIL", f"Expected 401, got {response.status_code}")
        return False
    
    return True

def test_admin_login():
    """Test admin login API"""
    global admin_token
    
    # Test valid admin login
    response, error = make_request('POST', '/auth/admin/login', ADMIN_CREDENTIALS, expected_status=200)
    
    if error:
        log_test("Admin Login API - Valid Credentials", "FAIL", error)
        return False
        
    try:
        data = response.json()
        if data.get('token') and data.get('user') and data['user']['role'] == 'admin':
            admin_token = data['token']
            log_test("Admin Login API - Valid Credentials", "PASS", "Admin login successful")
        else:
            log_test("Admin Login API - Valid Credentials", "FAIL", f"Missing token or invalid user: {data}")
            return False
    except:
        log_test("Admin Login API - Valid Credentials", "FAIL", "Invalid JSON response")
        return False
    
    # Test invalid admin credentials
    invalid_admin = {"email": "wrong@email.com", "password": "wrongpass"}
    response, error = make_request('POST', '/auth/admin/login', invalid_admin)
    
    if error:
        log_test("Admin Login API - Invalid Credentials", "FAIL", error)
        return False
    elif response and response.status_code == 401:
        try:
            data = response.json()
            if 'error' in data:
                log_test("Admin Login API - Invalid Credentials", "PASS", f"Invalid admin credentials handled correctly: {data['error']}")
                return True
            else:
                log_test("Admin Login API - Invalid Credentials", "FAIL", "No error message in response")
                return False
        except:
            log_test("Admin Login API - Invalid Credentials", "FAIL", "Invalid JSON response")
            return False
    else:
        log_test("Admin Login API - Invalid Credentials", "FAIL", f"Expected 401, got {response.status_code}")
        return False
    
    return True

def test_student_onboarding():
    """Test student onboarding APIs"""
    if not student_token:
        log_test("Student Onboarding API", "FAIL", "No student token available")
        return False
    
    headers = {"Authorization": f"Bearer {student_token}"}
    
    # Test profile onboarding
    profile_data = {
        "phone": "+1234567890",
        "education": "Bachelor's in Computer Science",
        "experience": "2 years",
        "skills": ["Python", "SQL", "Data Analysis"],
        "linkedin": "https://linkedin.com/in/johndoe",
        "github": "https://github.com/johndoe",
        "bio": "Passionate data analyst with experience in Python and SQL"
    }
    
    response, error = make_request('POST', '/onboarding', profile_data, headers, expected_status=200)
    
    if error:
        log_test("Student Onboarding API - Profile", "FAIL", error)
        return False
        
    try:
        data = response.json()
        if data.get('success'):
            log_test("Student Onboarding API - Profile", "PASS", "Profile updated successfully")
        else:
            log_test("Student Onboarding API - Profile", "FAIL", f"Unexpected response: {data}")
            return False
    except:
        log_test("Student Onboarding API - Profile", "FAIL", "Invalid JSON response")
        return False
    
    # Test aptitude test
    aptitude_data = {
        "answers": {"q1": "A", "q2": "B", "q3": "C", "q4": "A", "q5": "B"},
        "score": 80
    }
    
    response, error = make_request('POST', '/onboarding/aptitude', aptitude_data, headers, expected_status=200)
    
    if error:
        log_test("Student Onboarding API - Aptitude Test", "FAIL", error)
        return False
        
    try:
        data = response.json()
        if data.get('success') and data.get('score') == 80:
            log_test("Student Onboarding API - Aptitude Test", "PASS", f"Aptitude test completed with score: {data['score']}")
        else:
            log_test("Student Onboarding API - Aptitude Test", "FAIL", f"Unexpected response: {data}")
            return False
    except:
        log_test("Student Onboarding API - Aptitude Test", "FAIL", "Invalid JSON response")
        return False
    
    # Test payment (mocked)
    payment_data = {
        "payment_id": "test_payment_123",
        "amount": 9999
    }
    
    response, error = make_request('POST', '/onboarding/payment', payment_data, headers, expected_status=200)
    
    if error:
        log_test("Student Onboarding API - Payment", "FAIL", error)
        return False
        
    try:
        data = response.json()
        if data.get('success'):
            log_test("Student Onboarding API - Payment", "PASS", "Mock payment processed successfully")
        else:
            log_test("Student Onboarding API - Payment", "FAIL", f"Unexpected response: {data}")
            return False
    except:
        log_test("Student Onboarding API - Payment", "FAIL", "Invalid JSON response")
        return False
    
    return True

def test_admin_student_management():
    """Test admin student management APIs"""
    if not admin_token:
        log_test("Admin Student Management API", "FAIL", "No admin token available")
        return False
    
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # Test get all students
    response, error = make_request('GET', '/admin/students', headers=headers, expected_status=200)
    
    if error:
        log_test("Admin Student Management API - Get Students", "FAIL", error)
        return False
        
    try:
        data = response.json()
        if 'students' in data and isinstance(data['students'], list):
            log_test("Admin Student Management API - Get Students", "PASS", f"Retrieved {len(data['students'])} students")
        else:
            log_test("Admin Student Management API - Get Students", "FAIL", f"Unexpected response: {data}")
            return False
    except:
        log_test("Admin Student Management API - Get Students", "FAIL", "Invalid JSON response")
        return False
    
    # Test unlock week for student
    if student_id:
        unlock_data = {
            "student_id": student_id,
            "week_number": 2
        }
        
        response, error = make_request('PATCH', '/admin/unlock', unlock_data, headers, expected_status=200)
        
        if error:
            log_test("Admin Student Management API - Unlock Week", "FAIL", error)
            return False
            
        try:
            data = response.json()
            if data.get('success'):
                log_test("Admin Student Management API - Unlock Week", "PASS", "Week 2 unlocked successfully")
            else:
                log_test("Admin Student Management API - Unlock Week", "FAIL", f"Unexpected response: {data}")
                return False
        except:
            log_test("Admin Student Management API - Unlock Week", "FAIL", "Invalid JSON response")
            return False
    
    # Test promote student to talent pool
    if student_id:
        promote_data = {
            "student_id": student_id,
            "is_vetted": True
        }
        
        response, error = make_request('PATCH', '/admin/promote', promote_data, headers, expected_status=200)
        
        if error:
            log_test("Admin Student Management API - Promote Student", "FAIL", error)
            return False
            
        try:
            data = response.json()
            if data.get('success'):
                log_test("Admin Student Management API - Promote Student", "PASS", "Student promoted to talent pool")
            else:
                log_test("Admin Student Management API - Promote Student", "FAIL", f"Unexpected response: {data}")
                return False
        except:
            log_test("Admin Student Management API - Promote Student", "FAIL", "Invalid JSON response")
            return False
    
    return True

def test_company_talent_api():
    """Test company talent pool API"""
    if not company_token:
        log_test("Company Talent Pool API", "FAIL", "No company token available")
        return False
    
    headers = {"Authorization": f"Bearer {company_token}"}
    
    # Test get vetted students
    response, error = make_request('GET', '/company/talent', headers=headers, expected_status=200)
    
    if error:
        log_test("Company Talent Pool API - Get Talent", "FAIL", error)
        return False
        
    try:
        data = response.json()
        if 'talent' in data and isinstance(data['talent'], list):
            log_test("Company Talent Pool API - Get Talent", "PASS", f"Retrieved {len(data['talent'])} vetted candidates")
            return True
        else:
            log_test("Company Talent Pool API - Get Talent", "FAIL", f"Unexpected response: {data}")
            return False
    except:
        log_test("Company Talent Pool API - Get Talent", "FAIL", "Invalid JSON response")
        return False

def test_unauthorized_access():
    """Test unauthorized access to protected endpoints"""
    # Test without token
    response, error = make_request('GET', '/admin/students')
    
    if error:
        log_test("Authorization Test - No Token", "FAIL", error)
        return False
    elif response and response.status_code == 401:
        try:
            data = response.json()
            if 'error' in data:
                log_test("Authorization Test - No Token", "PASS", f"Unauthorized access blocked correctly: {data['error']}")
            else:
                log_test("Authorization Test - No Token", "FAIL", "No error message in response")
                return False
        except:
            log_test("Authorization Test - No Token", "FAIL", "Invalid JSON response")
            return False
    else:
        log_test("Authorization Test - No Token", "FAIL", f"Expected 401, got {response.status_code}")
        return False
    
    # Test with invalid token
    headers = {"Authorization": "Bearer invalid_token"}
    response, error = make_request('GET', '/admin/students', headers=headers)
    
    if error:
        log_test("Authorization Test - Invalid Token", "FAIL", error)
        return False
    elif response and response.status_code == 401:
        try:
            data = response.json()
            if 'error' in data:
                log_test("Authorization Test - Invalid Token", "PASS", f"Invalid token blocked correctly: {data['error']}")
            else:
                log_test("Authorization Test - Invalid Token", "FAIL", "No error message in response")
                return False
        except:
            log_test("Authorization Test - Invalid Token", "FAIL", "Invalid JSON response")
            return False
    else:
        log_test("Authorization Test - Invalid Token", "FAIL", f"Expected 401, got {response.status_code}")
        return False
    
    return True

def run_all_tests():
    """Run all backend API tests"""
    print("=" * 60)
    print("CadetX Backend API Testing Suite")
    print("=" * 60)
    print()
    
    test_results = []
    
    # Run tests in order
    tests = [
        ("Health Check", test_health_check),
        ("Seed Data Creation", test_seed_data),
        ("User Registration API", test_user_registration),
        ("User Login API", test_user_login),
        ("Admin Login API", test_admin_login),
        ("Student Onboarding API", test_student_onboarding),
        ("Admin Student Management API", test_admin_student_management),
        ("Company Talent Pool API", test_company_talent_api),
        ("Authorization Tests", test_unauthorized_access),
    ]
    
    for test_name, test_func in tests:
        print(f"Running {test_name}...")
        try:
            result = test_func()
            test_results.append((test_name, result))
        except Exception as e:
            log_test(test_name, "FAIL", f"Test crashed: {str(e)}")
            test_results.append((test_name, False))
        
        time.sleep(1)  # Brief pause between tests
    
    # Summary
    print("=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for _, result in test_results if result)
    total = len(test_results)
    
    for test_name, result in test_results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
    
    print()
    print(f"Total: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed!")
        return True
    else:
        print(f"⚠️  {total - passed} tests failed")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    exit(0 if success else 1)