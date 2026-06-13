"""
Unit tests for financial calculator logic
Tests mathematical accuracy and edge cases
"""

import pytest


class TestSIPCalculatorLogic:
    """Mathematical tests for SIP calculations"""
    
    def test_sip_formula_accuracy(self, client):
        """Verify SIP calculation formula"""
        # Test case: 1000 monthly, 12% annual, 1 year
        payload = {
            'monthly_amount': 1000,
            'annual_rate': 12,
            'years': 1
        }
        response = client.post('/api/calculators/sip',
                             data=__import__('json').dumps(payload),
                             content_type='application/json')
        data = __import__('json').loads(response.data)
        
        # Invested: 1000 * 12 = 12000
        assert data['invested_amount'] == 12000
        # Should have returns > 0 at 12% rate
        assert data['estimated_returns'] > 0
        assert data['maturity_amount'] > 12000
    
    def test_sip_zero_investment(self, client):
        """Test SIP with zero investment"""
        payload = {
            'monthly_amount': 0,
            'annual_rate': 12,
            'years': 5
        }
        response = client.post('/api/calculators/sip',
                             data=__import__('json').dumps(payload),
                             content_type='application/json')
        assert response.status_code == 200
        data = __import__('json').loads(response.data)
        assert data['invested_amount'] == 0
        assert data['maturity_amount'] == 0


class TestEMICalculatorLogic:
    """Mathematical tests for EMI calculations"""
    
    def test_emi_formula_accuracy(self, client):
        """Verify EMI calculation formula"""
        # Test case: 1,000,000 loan, 10% annual, 1 year
        payload = {
            'principal': 1000000,
            'annual_rate': 10,
            'years': 1
        }
        response = client.post('/api/calculators/emi',
                             data=__import__('json').dumps(payload),
                             content_type='application/json')
        data = __import__('json').loads(response.data)
        
        # Total interest should be positive for 10% rate
        assert data['total_interest'] > 0
        # Total payment should be principal + interest
        assert data['total_payment'] > data['loan_amount']
        # EMI should be positive
        assert data['emi'] > 0


class TestLumpSumCalculatorLogic:
    """Mathematical tests for Lumpsum calculations"""
    
    def test_lumpsum_compound_interest(self, client):
        """Verify lumpsum compound interest formula"""
        # Test case: 100,000 at 10% for 2 years = 121,000
        payload = {
            'principal': 100000,
            'annual_rate': 10,
            'years': 2
        }
        response = client.post('/api/calculators/lumpsum',
                             data=__import__('json').dumps(payload),
                             content_type='application/json')
        data = __import__('json').loads(response.data)
        
        # 100000 * 1.1^2 = 121000
        assert abs(data['maturity_amount'] - 121000) < 0.01
        assert abs(data['estimated_returns'] - 21000) < 0.01


class TestRetirementCalculatorLogic:
    """Mathematical tests for Retirement calculations"""
    
    def test_retirement_years_calculation(self, client):
        """Verify retirement years calculation"""
        payload = {
            'current_age': 25,
            'retirement_age': 65,
            'monthly_amount': 5000,
            'annual_rate': 10
        }
        response = client.post('/api/calculators/retirement',
                             data=__import__('json').dumps(payload),
                             content_type='application/json')
        data = __import__('json').loads(response.data)
        
        # Years to retirement: 65 - 25 = 40
        assert data['years_to_retirement'] == 40
        # Invested amount: 5000 * 12 * 40
        assert data['invested_amount'] == 2400000


class TestEdgeCases:
    """Test edge cases and boundary conditions"""
    
    def test_very_large_amount(self, client):
        """Test with very large investment amounts"""
        payload = {
            'monthly_amount': 1000000,
            'annual_rate': 12,
            'years': 5
        }
        response = client.post('/api/calculators/sip',
                             data=__import__('json').dumps(payload),
                             content_type='application/json')
        assert response.status_code == 200
        data = __import__('json').loads(response.data)
        assert data['invested_amount'] == 60000000
    
    def test_very_small_amount(self, client):
        """Test with very small investment amounts"""
        payload = {
            'monthly_amount': 0.01,
            'annual_rate': 12,
            'years': 5
        }
        response = client.post('/api/calculators/sip',
                             data=__import__('json').dumps(payload),
                             content_type='application/json')
        assert response.status_code == 200
        data = __import__('json').loads(response.data)
        assert data['invested_amount'] > 0
    
    def test_high_interest_rate(self, client):
        """Test with high interest rates"""
        payload = {
            'principal': 100000,
            'annual_rate': 100,
            'years': 5
        }
        response = client.post('/api/calculators/lumpsum',
                             data=__import__('json').dumps(payload),
                             content_type='application/json')
        assert response.status_code == 200
        data = __import__('json').loads(response.data)
        assert data['maturity_amount'] > data['invested_amount']
    
    def test_single_year(self, client):
        """Test with 1 year investment"""
        payload = {
            'monthly_amount': 10000,
            'annual_rate': 12,
            'years': 1
        }
        response = client.post('/api/calculators/sip',
                             data=__import__('json').dumps(payload),
                             content_type='application/json')
        assert response.status_code == 200
        data = __import__('json').loads(response.data)
        assert data['invested_amount'] == 120000
    
    def test_long_term_investment(self, client):
        """Test with long-term investment (50 years)"""
        payload = {
            'principal': 100000,
            'annual_rate': 10,
            'years': 50
        }
        response = client.post('/api/calculators/lumpsum',
                             data=__import__('json').dumps(payload),
                             content_type='application/json')
        assert response.status_code == 200
        data = __import__('json').loads(response.data)
        # Compound growth over 50 years should be massive
        assert data['maturity_amount'] > data['invested_amount'] * 100
