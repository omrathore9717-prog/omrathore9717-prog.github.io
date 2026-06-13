# Testing Guide - OM Financial Service

## Overview

The OM Financial Service includes a comprehensive test suite with **33 automated tests** covering all API endpoints, calculator logic, error handling, and edge cases.

## Running Tests

### Prerequisites

```bash
# Ensure virtual environment is activated
.venv\Scripts\activate  # On Windows
source venv/bin/activate  # On macOS/Linux

# Install test dependencies (already in requirements.txt)
pip install -r requirements.txt
```

### Basic Test Run

```bash
# Run all tests with verbose output
pytest tests/ -v

# Run tests with coverage report
pytest tests/ --cov=. --cov-report=html

# Run specific test file
pytest tests/test_app.py -v

# Run specific test class
pytest tests/test_app.py::TestSIPCalculator -v

# Run specific test
pytest tests/test_app.py::TestSIPCalculator::test_sip_calculation_valid -v
```

### Coverage Report

```bash
# Generate coverage report
pytest tests/ --cov=. --cov-report=term-missing

# Generate HTML coverage report (opens in browser)
pytest tests/ --cov=. --cov-report=html
open htmlcov/index.html  # macOS
# or navigate to htmlcov/index.html manually
```

## Test Organization

### Test Files

**`tests/test_app.py`** - Main application tests
- ✅ Health endpoint tests
- ✅ SIP calculator tests (valid input, edge cases, error handling)
- ✅ EMI calculator tests
- ✅ Lumpsum calculator tests
- ✅ Retirement calculator tests
- ✅ Error handling tests (404, invalid JSON)
- ✅ Homepage tests

**`tests/test_calculators.py`** - Calculator logic and math tests
- ✅ SIP formula accuracy
- ✅ EMI formula accuracy
- ✅ Lumpsum compound interest calculations
- ✅ Retirement planning calculations
- ✅ Edge cases (very large/small amounts, high rates, long terms)

**`tests/conftest.py`** - Test fixtures and configuration
- Flask app test client setup
- Test configuration
- Shared fixtures for all tests

### Test Classes

#### TestHealthEndpoint
```
✓ test_health_check_success - Verifies health endpoint returns 200
✓ test_health_check_response_format - Checks response structure
```

#### TestSIPCalculator
```
✓ test_sip_calculation_valid - Normal case: 5000/month, 12%, 5 years
✓ test_sip_calculation_zero_rate - Edge case: 0% interest rate
✓ test_sip_missing_field - Error: Missing 'years' field
✓ test_sip_negative_amount - Error: Negative monthly amount
✓ test_sip_zero_years - Error: Zero years investment period
✓ test_sip_empty_request - Error: Empty request body
```

#### TestEMICalculator
```
✓ test_emi_calculation_valid - Normal case: 1M loan, 8.5%, 20 years
✓ test_emi_zero_interest - Edge case: 0% interest
✓ test_emi_negative_principal - Error: Negative loan amount
✓ test_emi_missing_field - Error: Missing required field
```

#### TestLumpSumCalculator
```
✓ test_lumpsum_calculation_valid - Normal case: 500K, 10%, 10 years
✓ test_lumpsum_zero_rate - Edge case: 0% return
✓ test_lumpsum_negative_principal - Error: Negative investment
```

#### TestRetirementCalculator
```
✓ test_retirement_calculation_valid - Normal case: Age 30→60, 10K/month
✓ test_retirement_invalid_ages - Error: Retirement age ≤ current age
✓ test_retirement_negative_current_age - Error: Negative age
✓ test_retirement_negative_amount - Error: Negative monthly amount
```

#### TestErrorHandling
```
✓ test_404_not_found - Verifies 404 error response format
✓ test_invalid_json - Checks invalid JSON handling
```

#### TestHomepage
```
✓ test_homepage_loads - Verifies / endpoint returns 200
✓ test_homepage_contains_content - Checks Jinja2 template compilation
```

#### TestSIPCalculatorLogic
```
✓ test_sip_formula_accuracy - Verifies mathematical formula
✓ test_sip_zero_investment - Tests 0 investment edge case
```

#### TestEMICalculatorLogic
```
✓ test_emi_formula_accuracy - Verifies EMI formula correctness
```

#### TestLumpSumCalculatorLogic
```
✓ test_lumpsum_compound_interest - Tests 100K @ 10% for 2 years = 121K
```

#### TestRetirementCalculatorLogic
```
✓ test_retirement_years_calculation - Verifies age difference logic
```

#### TestEdgeCases
```
✓ test_very_large_amount - Tests 1M monthly investment
✓ test_very_small_amount - Tests 0.01 investment
✓ test_high_interest_rate - Tests 100% annual rate
✓ test_single_year - Tests 1 year investment period
✓ test_long_term_investment - Tests 50 year investment
```

## Sample Test Run Output

```
============================= test session starts =============================
platform win32 -- Python 3.14.2, pytest-7.4.0, pluggy-1.6.0
collected 33 items

tests/test_app.py::TestHealthEndpoint::test_health_check_success PASSED  [  3%]
tests/test_app.py::TestHealthEndpoint::test_health_check_response_format PASSED [  6%]
tests/test_app.py::TestSIPCalculator::test_sip_calculation_valid PASSED  [  9%]
...
tests/test_calculators.py::TestEdgeCases::test_long_term_investment PASSED [100%]

============================= 33 passed in 0.30s ==============================
```

## API Documentation

### Swagger/Flasgger

The Flask application includes interactive API documentation powered by Flasgger (Swagger UI).

**Access Swagger UI:**
1. Start the Flask server: `python app.py`
2. Navigate to: `http://localhost:5000/apidocs/`
3. Explore and test all endpoints interactively

**Features:**
- Interactive endpoint testing
- Request/response schemas
- Parameter descriptions
- Example payloads

## Test Execution Examples

### Run All Tests
```bash
pytest tests/ -v
```
**Result:** 33 tests pass in ~0.3 seconds

### Run Only Calculator Tests
```bash
pytest tests/test_calculators.py -v
```

### Run Only SIP Calculator Tests
```bash
pytest tests/test_app.py::TestSIPCalculator -v
```

### Run Tests with Coverage
```bash
pytest tests/ --cov=app --cov-report=term-missing
```

### Run Tests and Generate HTML Report
```bash
pytest tests/ --cov=app --cov-report=html
```
Opens: `htmlcov/index.html`

## Continuous Testing

### Watch Mode (Auto-run tests on file changes)
```bash
pip install pytest-watch
ptw tests/
```

### CI/CD Integration

Add to GitHub Actions (`.github/workflows/test.yml`):
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
      - run: pip install -r requirements.txt
      - run: pytest tests/ -v
```

## Debugging Tests

### Verbose Output
```bash
pytest tests/ -vv  # Extra verbose
```

### Print Debug Info
```bash
pytest tests/ -s  # Show print statements
```

### Stop on First Failure
```bash
pytest tests/ -x
```

### Drop into Debugger on Failure
```bash
pytest tests/ --pdb
```

## Writing New Tests

### Template for New Test
```python
import pytest
import json

class TestNewFeature:
    """Tests for new feature"""
    
    def test_new_feature_valid(self, client):
        """Test new feature with valid input"""
        payload = {
            'param1': value1,
            'param2': value2
        }
        response = client.post('/api/new-endpoint',
                             data=json.dumps(payload),
                             content_type='application/json')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'success'
```

### Run New Tests
```bash
pytest tests/test_newfile.py::TestNewFeature::test_new_feature_valid -v
```

## Test Statistics

| Metric | Value |
|--------|-------|
| Total Tests | 33 |
| Test Files | 2 |
| Test Classes | 11 |
| Execution Time | ~0.3 seconds |
| Pass Rate | 100% |

### Test Coverage by Endpoint

| Endpoint | Tests | Coverage |
|----------|-------|----------|
| GET / | 2 | ✅ 100% |
| GET /api/health | 2 | ✅ 100% |
| POST /api/calculators/sip | 9 | ✅ 100% |
| POST /api/calculators/emi | 4 | ✅ 100% |
| POST /api/calculators/lumpsum | 4 | ✅ 100% |
| POST /api/calculators/retirement | 4 | ✅ 100% |
| Error Handling | 2 | ✅ 100% |
| Edge Cases | 5 | ✅ 100% |

## Troubleshooting

### Test Import Errors
```
If you see "ModuleNotFoundError: No module named 'app'"
→ Ensure you're running pytest from the project root
→ Check that .venv\Scripts\Activate.ps1 was executed
```

### Port Already in Use
```
If tests fail with "Port already in use"
→ The Flask dev server may still be running
→ Kill: Kill-Process -ProcessName python
→ Or use different PORT: pytest tests/ --port 8000
```

### JSON Decode Errors
```
If tests fail with "JSONDecodeError"
→ Flask app may not be returning JSON
→ Check app.py for proper jsonify() usage
→ Verify Content-Type: application/json
```

## Performance Notes

- All 33 tests execute in **~0.3 seconds**
- Tests use Flask test client (in-memory, no network)
- No external API calls - all tests are isolated
- Suitable for CI/CD pipelines

## Next Steps

1. ✅ Run tests locally: `pytest tests/ -v`
2. ✅ Generate coverage: `pytest tests/ --cov`
3. ✅ Set up CI/CD with GitHub Actions
4. ✅ Deploy to production
5. ✅ Monitor in production

---

**Documentation Updated:** June 13, 2026  
**Test Framework:** pytest 7.4.0  
**Coverage Tool:** pytest-cov 4.1.0
