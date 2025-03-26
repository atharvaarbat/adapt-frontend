# ADAPT (Automated Defense and Threat Analysis Platform)

## Overview

ADAPT is an AI-powered navigation and threat analysis system designed to provide secure route planning with real-time threat assessment capabilities. The platform combines natural language processing with advanced routing algorithms to help users navigate complex environments while avoiding potential threats.

## Key Features

- **AI-Powered Navigation**: Conversational interface for natural route planning
- **Threat Assessment**: Dynamic risk evaluation based on multiple parameters
- **Adaptive Routing**: Real-time route adjustments based on changing conditions
- **Local AI Integration**: Supports both cloud-based and locally-hosted AI models
- **Customizable Parameters**: Fine-tuned control over risk tolerance and terrain preferences

## Technical Architecture

```
Frontend (React) ↔ AI Processing Layer ↔ Routing Engine ↔ Threat Intelligence Data
```

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Python (v3.10 or higher) for backend services
- LMStudio (optional, for local AI processing)

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/atharvaarbat/adapt-frontend.git
   cd ADAPT
   ```

2. **Install frontend dependencies**:
   ```bash
   cd frontend
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the frontend directory with:
   ```
   VITE_API_BASE_URL=http://localhost:5000
   VITE_OPENROUTER_API_KEY=your_key_here (optional)
   ```

4. **Set up backend services**:
   ```bash
   cd ../backend
   pip install -r requirements.txt
   ```

## Running the Application

### Development Mode

1. **Start the frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Start the backend**:
   ```bash
   cd ../backend
   python app.py
   ```

3. **Start LMStudio (optional)**:
   - Launch LMStudio and load your preferred model
   - Enable API server on port 1234

The application will be available at `http://localhost:5173`

## Configuration Options

### AI Service Configuration

Choose between:
- **OpenRouter** (cloud-based): Set `VITE_OPENROUTER_API_KEY`
- **LMStudio** (local): Configure in `src/services/aiService.js`

### Routing Parameters

Customize in `src/components/RouteParameters.js`:
- Default risk tolerance levels
- Terrain difficulty scales
- Location datasets

## API Documentation

### Navigation API (Backend)

**Endpoint**: `POST /find_route`

**Request Format**:
```json
{
  "start": "location_id",
  "end": "location_id",
  "remove_array": ["location_name"],
  "terrain_difficulty": 0-100
}
```

**Response Format**:
```json
{
  "route": [],
  "total_cost": 0,
  "threat_assessment": {}
}
```

### AI Processing API

**Endpoint**: `POST /v1/chat/completions` (LMStudio) or OpenRouter equivalent

**Request Format**:
```json
{
  "model": "model_name",
  "messages": [],
  "response_format": {
    "type": "json_object"
  }
}
```

## Usage Examples

1. **Basic Route Planning**:
   - Select start and end locations
   - Set risk tolerance and terrain preferences
   - View generated route with threat analysis

2. **Dynamic Adjustments**:
   - "Avoid high-risk areas"
   - "Find an easier terrain path"
   - "Change start point to Secure Zone A"

3. **Threat Analysis**:
   - View color-coded risk levels along route
   - See alternative route suggestions
   - Adjust parameters in real-time

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure backend has CORS enabled
   - Verify correct API base URL in frontend .env

2. **AI Service Unavailable**:
   - Check LMStudio is running (if using local AI)
   - Verify API keys (if using cloud service)

3. **Route Calculation Failures**:
   - Validate location IDs exist in dataset
   - Check backend logs for specific errors

## Contributing

We welcome contributions! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request with clear documentation


## Contact
arbatatharva130@gmail.com

For support or inquiries, contact: [adapt-support@yourorg.com](mailto:adapt-support@yourorg.com)

---

**Note**: This is a beta release. Please report any issues through our [GitHub Issues](https://github.com/your-organization/ADAPT/issues) page.
