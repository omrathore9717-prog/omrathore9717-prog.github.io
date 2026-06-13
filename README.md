# OM Financial Service - Python/Flask Backend

A modern financial planning web application built with **Flask** (Python) backend and vanilla JavaScript frontend. Provides SIP calculators, EMI tools, and comprehensive investment planning features.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip (Python package manager)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd om-financial-service
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask application**
   ```bash
   python app.py
   ```
   
   The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
om-financial-service/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # Jinja2 template (main page)
├── static/
│   ├── css/
│   │   └── style.css     # Main stylesheet
│   ├── js/
│   │   └── script.js     # Client-side JavaScript
│   └── images/           # SVG assets and logos
├── render.yaml           # Render.com deployment config
├── robots.txt            # SEO robots directive
├── sitemap.xml           # SEO sitemap
└── CNAME                 # GitHub Pages CNAME record
```

## 🔧 Configuration

### Environment Variables

- `FLASK_ENV`: Set to `development` for debug mode, `production` for production
- `PORT`: Server port (default: 5000)

### CORS Configuration

CORS is enabled for the following origins:
- `https://omfinancialservice.com`
- `https://www.omfinancialservice.com`
- `http://localhost:5500`
- `http://127.0.0.1:5500`
- `http://localhost:5000`
- `http://127.0.0.1:5000`

## 📊 API Endpoints

### Routes

#### `GET /`
Returns the main landing page (HTML)

#### `GET /api/health`
Health check endpoint
```json
{
  "status": "success",
  "message": "OM Financial Service API is running",
  "service": "OM Financial Service Backend"
}
```

#### `POST /api/calculators/sip`
SIP (Systematic Investment Plan) Calculator

**Request:**
```json
{
  "monthly_amount": 5000,
  "annual_rate": 12,
  "years": 10
}
```

**Response:**
```json
{
  "status": "success",
  "invested_amount": 600000,
  "estimated_returns": 726420.23,
  "maturity_amount": 1326420.23,
  "monthly_investment": 5000,
  "annual_rate": 12,
  "years": 10
}
```

#### `POST /api/calculators/emi`
EMI (Equated Monthly Installment) Calculator

**Request:**
```json
{
  "loan_amount": 500000,
  "annual_rate": 7.5,
  "years": 5
}
```

**Response:**
```json
{
  "status": "success",
  "emi": 9965.73,
  "total_payment": 598143.8,
  "total_interest": 98143.8,
  "loan_amount": 500000,
  "annual_rate": 7.5,
  "years": 5
}
```

#### `POST /api/calculators/lumpsum`
Lumpsum Investment Calculator

**Request:**
```json
{
  "investment_amount": 100000,
  "annual_rate": 8,
  "years": 5
}
```

**Response:**
```json
{
  "status": "success",
  "invested_amount": 100000,
  "estimated_returns": 46933.0,
  "maturity_amount": 146933.0,
  "annual_rate": 8,
  "years": 5
}
```

#### `POST /api/calculators/retirement`
Retirement Planning Calculator

**Request:**
```json
{
  "current_age": 30,
  "retirement_age": 60,
  "monthly_investment": 15000,
  "annual_rate": 10
}
```

**Response:**
```json
{
  "status": "success",
  "invested_amount": 5400000,
  "estimated_corpus": 15672850.5,
  "growth": 10272850.5,
  "years_to_retirement": 30,
  "current_age": 30,
  "retirement_age": 60
}
```

## 🚢 Deployment

### Render.com

The project is configured for automatic deployment on Render.com:

1. Connect your GitHub repository to Render.com
2. The `render.yaml` file will be automatically detected
3. The service will:
   - Install Python dependencies from `requirements.txt`
   - Start the application using `gunicorn app:app`
   - Set Python environment variables

### GitHub Pages (Frontend)

The static `index.html`, `style.css`, and images are served by Flask but can also be deployed to GitHub Pages:

1. The frontend files are completely independent of backend logic
2. Calculator logic runs client-side with JavaScript
3. To deploy to GitHub Pages, upload the `static/` contents

## 🔧 Development

### Running Tests

```bash
pytest tests/
```

### Code Style

Format code with Black:
```bash
black app.py
```

### Hot Reload

For development, use Flask's built-in auto-reload:
```bash
FLASK_ENV=development python app.py
```

## 📋 Features

- ✅ **SIP Calculator**: Plan systematic investments
- ✅ **EMI Calculator**: Calculate loan payments
- ✅ **Lumpsum Calculator**: One-time investment projections
- ✅ **Retirement Planner**: Long-term retirement planning
- ✅ **Responsive Design**: Works on all devices
- ✅ **SEO Optimized**: Structured data and meta tags
- ✅ **Fast Charts**: Chart.js visualizations
- ✅ **CORS Enabled**: API accessible from frontend

## 🛠️ Technology Stack

- **Backend**: Flask (Python 3.8+)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Charts**: Chart.js
- **Animations**: GSAP
- **Server**: Gunicorn
- **Deployment**: Render.com
- **Domain**: GitHub Pages + CNAME

## 📝 License

Proprietary - OM Financial Service

## 📞 Support

For questions or support:
- **Phone**: +919717857755
- **WhatsApp**: https://wa.me/919717857755

## 🔄 Migration from Node.js

This project was migrated from Node.js/Express to Python/Flask:

**Changes Made:**
- `backend/server.js` → `app.py` (Flask application)
- `backend/package.json` → `requirements.txt` (Python dependencies)
- Express routes → Flask blueprints
- Node.js environment → Python environment

**Benefits:**
- Simpler deployment on Python-based platforms
- Better performance with Gunicorn
- Easier maintenance and scaling
- Identical API endpoints and functionality
