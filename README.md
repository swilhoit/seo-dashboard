# SEO Dashboard Tool

A comprehensive SEO dashboard tool similar to SEMrush with keyword research, domain analytics, competitor analysis, and SERP analysis features. This tool fully integrates with the DataForSEO API to provide real-time, professional-grade SEO insights for your marketing decisions.

## Features

- **Keyword Research**: Analyze search volume, keyword difficulty, and related keywords using real-time data from DataForSEO
- **Domain Analytics**: Get comprehensive insights into any website's SEO performance with actual domain metrics
- **Competitor Analysis**: Compare your website against competitors and identify opportunities with live competitive data
- **SERP Analysis**: Examine search engine results pages for any keyword with the latest SERP features and rankings
- **Modern UI**: Beautiful and responsive interface built with React and Material UI
- **Real-time Data**: All components fully integrated with the DataForSEO API for accurate analytics

## Tech Stack

### Backend
- Python 3.x
- Flask (REST API)
- DataForSEO API integration

### Frontend
- React 18
- TypeScript
- Material UI
- Chart.js for data visualization

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- Python 3.7+
- DataForSEO API credentials (sign up at https://dataforseo.com/)

### Quick Start

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd seo_dashboard
   ```

2. Copy the environment file and add your credentials:
   ```bash
   cp .env.example .env
   # Edit .env and add your DataForSEO credentials
   ```

3. Run the setup script:
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

### Manual Setup

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   ```bash
   # Copy .env.example to .env and edit with your credentials
   cp ../.env.example ../.env
   ```

5. Start the Flask server:
   ```bash
   python app.py
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

4. Access the application at `http://localhost:3000`

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# DataForSEO API Credentials (Required)
DATAFORSEO_USERNAME=your_dataforseo_username
DATAFORSEO_PASSWORD=your_dataforseo_password

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=1
SECRET_KEY=your_secret_key_here
```

**⚠️ Important Security Notes:**
- Never commit your `.env` file to version control
- Keep your DataForSEO credentials secure
- Use different credentials for production environments

## Using the Dashboard

### Keyword Research
Enter keywords to analyze their search volume, competition, and difficulty. Identify new keyword opportunities and track performance over time.

### Domain Analytics
Enter a domain to see its organic traffic, ranking keywords, and backlink profile. Understand how well a website is performing in search.

### Competitor Analysis
Compare your website against competitors to find keyword gaps, content opportunities, and strengths/weaknesses in your SEO strategy.

### SERP Analysis
Analyze the search engine results page for any keyword to understand what it takes to rank on the first page.

## API Documentation

The backend provides several API endpoints:

- `/api/keyword-research/*` - Keyword analysis endpoints
- `/api/domain-analytics/*` - Domain analysis endpoints
- `/api/competitor-analysis/*` - Competitor analysis endpoints
- `/api/serp/*` - SERP analysis endpoints

For detailed API documentation, see the API Blueprint in the `/docs` folder.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
