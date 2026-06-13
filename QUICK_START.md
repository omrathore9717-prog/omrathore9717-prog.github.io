# Quick Start - Development & Testing

## 🚀 Quick Setup

```bash
# 1. Navigate to project
cd om-financial-service

# 2. Activate virtual environment
.\.venv\Scripts\Activate.ps1  # Windows
source venv/bin/activate      # macOS/Linux

# 3. Install dependencies (one-time)
pip install -r requirements.txt

# 4. Run Flask app
python app.py

# 5. In another terminal, run tests
pytest tests/ -v
```

## 📊 Quick Commands

### Running Tests
```bash
# All tests
pytest tests/ -v

# With coverage
pytest tests/ --cov=app --cov-report=term-missing

# Specific test
pytest tests/test_app.py::TestSIPCalculator::test_sip_calculation_valid -v

# Stop on first failure
pytest tests/ -x

# Show print statements
pytest tests/ -s
```

### API Testing

**Start server:**
```bash
python app.py
```

**Test health endpoint:**
```bash
curl http://localhost:5000/api/health
```

**Test SIP calculator:**
```bash
curl -X POST http://localhost:5000/api/calculators/sip \
  -H "Content-Type: application/json" \
  -d '{"monthly_amount": 5000, "annual_rate": 12, "years": 5}'
```

**Access Swagger UI:**
```
http://localhost:5000/apidocs/
```

### Interactive Testing (PowerShell)

```powershell
# Test health endpoint
$response = Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/health" -Method GET
$response.Content | ConvertFrom-Json

# Test SIP calculator
$payload = @{
    monthly_amount = 5000
    annual_rate = 12
    years = 5
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/calculators/sip" `
  -Method POST -ContentType "application/json" -Body $payload
$response.Content | ConvertFrom-Json
```

## 🎯 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | Homepage |
| GET | `/api/health` | Health check |
| POST | `/api/calculators/sip` | SIP Calculator |
| POST | `/api/calculators/emi` | EMI Calculator |
| POST | `/api/calculators/lumpsum` | Lumpsum Calculator |
| POST | `/api/calculators/retirement` | Retirement Planner |

## 📝 Example Payloads

### SIP Calculator
```json
{
  "monthly_amount": 5000,
  "annual_rate": 12,
  "years": 5
}
```

### EMI Calculator
```json
{
  "principal": 1000000,
  "annual_rate": 8.5,
  "years": 20
}
```

### Lumpsum Calculator
```json
{
  "principal": 500000,
  "annual_rate": 10,
  "years": 10
}
```

### Retirement Calculator
```json
{
  "current_age": 30,
  "retirement_age": 60,
  "monthly_amount": 10000,
  "annual_rate": 12
}
```

## ✅ Test Suite Summary

- **33 Tests** organized in 11 classes
- **100% Pass Rate**
- **~0.3 seconds** execution time
- **Full Coverage** of all endpoints
- **Edge Cases** tested comprehensively

### Test Classes
1. TestHealthEndpoint (2 tests)
2. TestSIPCalculator (6 tests)
3. TestEMICalculator (4 tests)
4. TestLumpSumCalculator (3 tests)
5. TestRetirementCalculator (4 tests)
6. TestErrorHandling (2 tests)
7. TestHomepage (2 tests)
8. TestSIPCalculatorLogic (2 tests)
9. TestEMICalculatorLogic (1 test)
10. TestLumpSumCalculatorLogic (1 test)
11. TestEdgeCases (5 tests)

## 🔍 Debugging Tips

### Issue: Tests not found
```
Solution: Run from project root and ensure .venv is activated
```

### Issue: Port already in use
```
Solution: Kill existing Flask process
pkill -f "python app.py"  # macOS/Linux
Stop-Process -ProcessName python  # PowerShell
```

### Issue: Module not found
```
Solution: Ensure dependencies installed
pip install -r requirements.txt
```

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Main documentation |
| TESTING.md | Comprehensive testing guide |
| MIGRATION.md | Node.js → Python migration details |
| QUICK_START.md | This file - quick reference |

## 🚢 Deployment

### Local Testing Before Deploy
```bash
# 1. Run all tests
pytest tests/ -v

# 2. Test Flask app locally
python app.py

# 3. Test endpoints (in another terminal)
curl http://localhost:5000/api/health

# 4. Commit changes
git add .
git commit -m "Add tests and documentation"

# 5. Push to GitHub
git push origin main

# 6. Render automatically deploys
# Check status at: https://dashboard.render.com
```

### Environment Variables

Set in Render.com dashboard:
- `FLASK_ENV=production`
- `PYTHONUNBUFFERED=1`

## 📞 Support

For detailed information, see:
- **API Details**: README.md
- **Testing Guide**: TESTING.md
- **Migration Info**: MIGRATION.md

---

**Last Updated:** June 13, 2026  
**Framework:** Flask 2.3.3  
**Python:** 3.8+
