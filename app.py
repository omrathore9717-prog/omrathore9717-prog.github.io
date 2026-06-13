"""
OM Financial Service - Flask Application
Python-based web server for financial planning and investment tools
"""

from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from flasgger import Flasgger
import os

# Initialize Flask app
app = Flask(__name__, template_folder='templates', static_folder='static', static_url_path='/static')

# Initialize Flasgger for API documentation
swagger = Flasgger(app)

# Enable CORS for all routes
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://omfinancialservice.com",
            "https://www.omfinancialservice.com",
            "http://localhost:5500",
            "http://127.0.0.1:5500",
            "http://localhost:5000",
            "http://127.0.0.1:5000"
        ]
    }
})

# Configuration
app.config['DEBUG'] = os.getenv('FLASK_ENV', 'production') == 'development'

# ============================
# VALIDATION HELPERS
# ============================

def validate_positive_numbers(*args):
    """Validate that all arguments are positive numbers"""
    for val in args:
        if val is None or val < 0:
            return False
    return True

def validate_age_difference(current_age, retirement_age):
    """Validate age logic"""
    if current_age < 0 or retirement_age <= current_age:
        return False
    return True

# ============================
# ROUTES
# ============================

@app.route('/')
def index():
    """Render the main landing page"""
    return render_template('index.html')

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring"""
    return jsonify({
        'status': 'success',
        'message': 'OM Financial Service API is running',
        'service': 'OM Financial Service Backend'
    }), 200

@app.route('/api/calculators/sip', methods=['POST'])
def sip_calculator():
    """SIP Calculator API
    ---
    tags:
      - Calculators
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            monthly_amount:
              type: number
              description: Monthly investment amount (₹)
              example: 5000
            annual_rate:
              type: number
              description: Annual interest rate (%)
              example: 12
            years:
              type: integer
              description: Investment period (years)
              example: 5
          required:
            - monthly_amount
            - annual_rate
            - years
    responses:
      200:
        description: Successful calculation
        schema:
          type: object
          properties:
            status:
              type: string
            invested_amount:
              type: number
            estimated_returns:
              type: number
            maturity_amount:
              type: number
      400:
        description: Invalid input parameters
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request body cannot be empty'}), 400
        
        monthly = float(data.get('monthly_amount', 0))
        rate = float(data.get('annual_rate', 0))
        years = int(data.get('years', 0))
        
        if not validate_positive_numbers(monthly, rate, years) or years == 0:
            return jsonify({'error': 'All values must be positive numbers and years must be greater than 0'}), 400
        
        # Calculate SIP
        months = years * 12
        monthly_rate = rate / 12 / 100
        
        if monthly_rate == 0:
            maturity = monthly * months
        else:
            maturity = monthly * ((pow(1 + monthly_rate, months) - 1) / monthly_rate) * (1 + monthly_rate)
        
        invested = monthly * months
        returns = maturity - invested
        
        return jsonify({
            'status': 'success',
            'invested_amount': round(invested, 2),
            'estimated_returns': round(returns, 2),
            'maturity_amount': round(maturity, 2),
            'monthly_investment': monthly,
            'annual_rate': rate,
            'years': years
        }), 200
    
    except (ValueError, KeyError, TypeError) as e:
        return jsonify({'error': 'Invalid input parameters', 'details': str(e)}), 400

@app.route('/api/calculators/emi', methods=['POST'])
def emi_calculator():
    """EMI Calculator API
    ---
    tags:
      - Calculators
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            principal:
              type: number
              description: Loan amount (₹)
              example: 1000000
            annual_rate:
              type: number
              description: Annual interest rate (%)
              example: 8.5
            years:
              type: integer
              description: Loan tenure (years)
              example: 20
          required:
            - principal
            - annual_rate
            - years
    responses:
      200:
        description: Successful calculation
      400:
        description: Invalid input parameters
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request body cannot be empty'}), 400
        
        principal = float(data.get('principal', 0))
        annual_rate = float(data.get('annual_rate', 0))
        years = int(data.get('years', 0))
        
        if not validate_positive_numbers(principal, annual_rate, years) or years == 0:
            return jsonify({'error': 'All values must be positive numbers and years must be greater than 0'}), 400
        
        # Calculate EMI
        months = years * 12
        monthly_rate = annual_rate / 12 / 100
        
        if monthly_rate == 0:
            emi = principal / months if months > 0 else 0
        else:
            emi = principal * monthly_rate * pow(1 + monthly_rate, months) / (pow(1 + monthly_rate, months) - 1)
        
        total_payment = emi * months
        total_interest = total_payment - principal
        
        return jsonify({
            'status': 'success',
            'emi': round(emi, 2),
            'total_payment': round(total_payment, 2),
            'total_interest': round(total_interest, 2),
            'loan_amount': principal,
            'annual_rate': annual_rate,
            'years': years
        }), 200
    
    except (ValueError, KeyError, TypeError) as e:
        return jsonify({'error': 'Invalid input parameters', 'details': str(e)}), 400

@app.route('/api/calculators/lumpsum', methods=['POST'])
def lumpsum_calculator():
    """Lumpsum Investment Calculator API
    ---
    tags:
      - Calculators
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            principal:
              type: number
              description: Investment amount (₹)
              example: 500000
            annual_rate:
              type: number
              description: Annual return rate (%)
              example: 10
            years:
              type: integer
              description: Investment period (years)
              example: 10
          required:
            - principal
            - annual_rate
            - years
    responses:
      200:
        description: Successful calculation
      400:
        description: Invalid input parameters
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request body cannot be empty'}), 400
        
        principal = float(data.get('principal', 0))
        rate = float(data.get('annual_rate', 0))
        years = int(data.get('years', 0))
        
        if not validate_positive_numbers(principal, rate, years) or years == 0:
            return jsonify({'error': 'All values must be positive numbers and years must be greater than 0'}), 400
        
        # Calculate compound interest
        r = rate / 100
        maturity = principal * pow(1 + r, years)
        returns = maturity - principal
        
        return jsonify({
            'status': 'success',
            'invested_amount': round(principal, 2),
            'estimated_returns': round(returns, 2),
            'maturity_amount': round(maturity, 2),
            'annual_rate': rate,
            'years': years
        }), 200
    
    except (ValueError, KeyError, TypeError) as e:
        return jsonify({'error': 'Invalid input parameters', 'details': str(e)}), 400

@app.route('/api/calculators/retirement', methods=['POST'])
def retirement_calculator():
    """Retirement Planning Calculator API
    ---
    tags:
      - Calculators
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            current_age:
              type: integer
              description: Current age (years)
              example: 30
            retirement_age:
              type: integer
              description: Target retirement age (years)
              example: 60
            monthly_amount:
              type: number
              description: Monthly investment amount (₹)
              example: 10000
            annual_rate:
              type: number
              description: Annual return rate (%)
              example: 12
          required:
            - current_age
            - retirement_age
            - monthly_amount
            - annual_rate
    responses:
      200:
        description: Successful calculation
      400:
        description: Invalid input parameters
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request body cannot be empty'}), 400
        
        current_age = int(data.get('current_age', 0))
        retirement_age = int(data.get('retirement_age', 0))
        monthly = float(data.get('monthly_amount', 0))
        rate = float(data.get('annual_rate', 0))
        
        if not validate_age_difference(current_age, retirement_age):
            return jsonify({'error': 'Current age must be positive and less than retirement age'}), 400
        
        if not validate_positive_numbers(monthly, rate):
            return jsonify({'error': 'Monthly amount and rate must be positive numbers'}), 400
        
        # Calculate retirement corpus
        years = retirement_age - current_age
        months = years * 12
        monthly_rate = rate / 12 / 100
        
        if monthly_rate == 0:
            future_value = monthly * months
        else:
            future_value = monthly * ((pow(1 + monthly_rate, months) - 1) / monthly_rate)
        
        invested = monthly * months
        growth = future_value - invested
        
        return jsonify({
            'status': 'success',
            'invested_amount': round(invested, 2),
            'estimated_corpus': round(future_value, 2),
            'growth': round(growth, 2),
            'years_to_retirement': years,
            'current_age': current_age,
            'retirement_age': retirement_age
        }), 200
    
    except (ValueError, KeyError, TypeError) as e:
        return jsonify({'error': 'Invalid input parameters', 'details': str(e)}), 400

# ============================
# ERROR HANDLERS
# ============================

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500

# ============================
# APPLICATION ENTRY POINT
# ============================

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=app.config['DEBUG'])
