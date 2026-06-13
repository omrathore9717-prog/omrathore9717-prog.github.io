"""
Test suite for OM Financial Service Flask Application
Tests all API endpoints and calculator logic
"""

import pytest
import json


class TestHealthEndpoint:
    """Tests for health check endpoint"""
    
    def test_health_check_success(self, client):
        """Test health check returns 200 with correct format"""
        response = client.get('/api/health')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'success'
        assert 'message' in data
        assert 'service' in data
    
    def test_health_check_response_format(self, client):
        """Test health check response has all required fields"""
        response = client.get('/api/health')
        data = json.loads(response.data)
        assert 'status' in data
        assert 'message' in data
        assert 'service' in data
        assert data['status'] == 'success'


class TestSIPCalculator:
    """Tests for SIP Calculator endpoint"""
    
    def test_sip_calculation_valid(self, client):
        """Test SIP calculator with valid input"""
        payload = {
            'monthly_amount': 5000,
            'annual_rate': 12,
            'years': 5
        }
        response = client.post('/api/calculators/sip',
                             data=json.dumps(payload),
                             content_type='application/json')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'success'
        assert 'invested_amount' in data
        assert 'estimated_returns' in data
        assert 'maturity_amount' in data
        assert data['invested_amount'] > 0
        assert data['maturity_amount'] >= data['invested_amount']
    
    def test_sip_calculation_zero_rate(self, client):
        """Test SIP with zero interest rate"""
        payload = {
            'monthly_amount': 5000,
            'annual_rate': 0,
            'years': 5
        }
        response = client.post('/api/calculators/sip',
                             data=json.dumps(payload),
                             content_type='application/json')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'success'
        assert data['invested_amount'] == 300000  # 5000 * 12 * 5
        assert data['estimated_returns'] == 0
    
    def test_sip_missing_field(self, client):
        """Test SIP with missing required field"""
        payload = {
            'monthly_amount': 5000,
            'annual_rate': 12
            # Missing 'years'
        }
        response = client.post('/api/calculators/sip',
                             data=json.dumps(payload),
                             content_type='application/json')
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
    
    def test_sip_negative_amount(self, client):
        """Test SIP with negative amount"""
        payload = {
            'monthly_amount': -5000,
            'annual_rate': 12,
            'years': 5
        }
        response = client.post('/api/calculators/sip',
                             data=json.dumps(payload),
                             content_type='application/json')
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
    
    def test_sip_zero_years(self, client):
        """Test SIP with zero years"""
        payload = {
            'monthly_amount': 5000,
            'annual_rate': 12,
            'years': 0
        }
        response = client.post('/api/calculators/sip',
                             data=json.dumps(payload),
                             content_type='application/json')
        assert response.status_code == 400
    
    def test_sip_empty_request(self, client):
        """Test SIP with empty request body"""
        response = client.post('/api/calculators/sip',
                             data=json.dumps({}),
                             content_type='application/json')
        assert response.status_code == 400


class TestEMICalculator:
    """Tests for EMI Calculator endpoint"""
    
    def test_emi_calculation_valid(self, client):
        """Test EMI calculator with valid input"""
        payload = {
            'principal': 1000000,
            'annual_rate': 8.5,
            'years': 20
        }
        response = client.post('/api/calculators/emi',
                             data=json.dumps(payload),
                             content_type='application/json')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'success'
        assert 'emi' in data
        assert 'total_payment' in data
        assert 'total_interest' in data
        assert data['emi'] > 0
        assert data['total_payment'] > data['loan_amount']
    
    def test_emi_zero_interest(self, client):
        """Test EMI with zero interest rate"""
        payload = {
            'principal': 1000000,
            'annual_rate': 0,
            'years': 20
        }
        response = client.post('/api/calculators/emi',
                             data=json.dumps(payload),
                             content_type='application/json')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['total_interest'] == 0
    
    def test_emi_negative_principal(self, client):
        """Test EMI with negative principal"""
        payload = {
            'principal': -1000000,
            'annual_rate': 8.5,
            'years': 20
        }
        response = client.post('/api/calculators/emi',
                             data=json.dumps(payload),
                             content_type='application/json')
        assert response.status_code == 400
    
    def test_emi_missing_field(self, client):
        """Test EMI with missing field"""
        payload = {
            'principal': 1000000,
            'annual_rate': 8.5
            # Missing 'years'
        }
        response = client.post('/api/calculators/emi',
                             data=json.dumps(payload),
                             content_type='application/json')
        assert response.status_code == 400


class TestLumpSumCalculator:
    """Tests for Lumpsum Investment Calculator"""
    
    def test_lumpsum_calculation_valid(self, client):
        """Test lumpsum calculator with valid input"""
        payload = {
            'principal': 500000,
            'annual_rate': 10,
            'years': 10
        }
        response = client.post('/api/calculators/lumpsum',
                             data=json.dumps(payload),
                             content_type='application/json')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'success'
        assert 'invested_amount' in data
        assert 'estimated_returns' in data
        assert 'maturity_amount' in data
        assert data['invested_amount'] == 500000
        assert data['maturity_amount'] > data['invested_amount']
    
    def test_lumpsum_zero_rate(self, client):
        """Test lumpsum with zero rate"""
        payload = {
            'principal': 500000,
            'annual_rate': 0,
            'years': 10
        }
        response = client.post('/api/calculators/lumpsum',
                             data=json.dumps(payload),
                             content_type='application/json')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['maturity_amount'] == data['invested_amount']
        assert data['estimated_returns'] == 0
    
    def test_lumpsum_negative_principal(self, client):
        """Test lumpsum with negative principal"""
        payload = {
            'principal': -500000,
            'annual_rate': 10,
            'years': 10
        }
        response = client.post('/api/calculators/lumpsum',
                             data=json.dumps(payload),
                             content_type='application/json')
        assert response.status_code == 400


class TestRetirementCalculator:
    """Tests for Retirement Planning Calculator"""
    
    def test_retirement_calculation_valid(self, client):
        """Test retirement calculator with valid input"""
        payload = {
            'current_age': 30,
            'retirement_age': 60,
            'monthly_amount': 10000,
            'annual_rate': 12
        }
        response = client.post('/api/calculators/retirement',
                             data=json.dumps(payload),
                             content_type='application/json')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'success'
        assert data['years_to_retirement'] == 30
        assert 'invested_amount' in data
        assert 'estimated_corpus' in data
        assert 'growth' in data
        assert data['estimated_corpus'] > data['invested_amount']
    
    def test_retirement_invalid_ages(self, client):
        """Test retirement with retirement_age <= current_age"""
        payload = {
            'current_age': 60,
            'retirement_age': 60,
            'monthly_amount': 10000,
            'annual_rate': 12
        }
        response = client.post('/api/calculators/retirement',
                             data=json.dumps(payload),
                             content_type='application/json')
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
    
    def test_retirement_negative_current_age(self, client):
        """Test retirement with negative current age"""
        payload = {
            'current_age': -30,
            'retirement_age': 60,
            'monthly_amount': 10000,
            'annual_rate': 12
        }
        response = client.post('/api/calculators/retirement',
                             data=json.dumps(payload),
                             content_type='application/json')
        assert response.status_code == 400
    
    def test_retirement_negative_amount(self, client):
        """Test retirement with negative monthly amount"""
        payload = {
            'current_age': 30,
            'retirement_age': 60,
            'monthly_amount': -10000,
            'annual_rate': 12
        }
        response = client.post('/api/calculators/retirement',
                             data=json.dumps(payload),
                             content_type='application/json')
        assert response.status_code == 400


class TestErrorHandling:
    """Tests for error handling"""
    
    def test_404_not_found(self, client):
        """Test 404 error handling"""
        response = client.get('/api/invalid-endpoint')
        assert response.status_code == 404
        data = json.loads(response.data)
        assert 'error' in data
    
    def test_invalid_json(self, client):
        """Test invalid JSON in request"""
        response = client.post('/api/calculators/sip',
                             data='invalid json',
                             content_type='application/json')
        assert response.status_code == 400


class TestHomepage:
    """Tests for homepage"""
    
    def test_homepage_loads(self, client):
        """Test homepage returns 200"""
        response = client.get('/')
        assert response.status_code == 200
    
    def test_homepage_contains_content(self, client):
        """Test homepage contains expected content"""
        response = client.get('/')
        assert response.status_code == 200
        # Check that it's not returning raw Jinja2 syntax
        assert 'url_for' not in response.data.decode('utf-8')
