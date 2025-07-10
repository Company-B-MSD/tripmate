# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# TripMate Frontend

A React + Vite application for the TripMate travel planning platform.

## Environment Setup

1. Copy the environment example file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your configuration:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   VITE_API_BASE_URL=http://localhost:8080
   ```

## API Configuration

This project uses a centralized API configuration located in `src/lib/api.js`. All backend API calls go through this centralized system.

### Features:

- **Centralized Configuration**: All API endpoints are defined in one place
- **Environment-based URLs**: Backend URL is configurable via environment variables
- **Automatic Authentication**: Token is automatically added to requests
- **Error Handling**: Global error handling with automatic token refresh
- **Axios Integration**: Pre-configured axios instance with interceptors

### Usage:

Import the API utilities:

```javascript
import { api, apiClient, API_ENDPOINTS } from '@/lib/api';
```

Use the pre-defined API methods:

```javascript
// Authentication
const response = await api.login({ username, password });
const registrationResponse = await api.register(userData);

// Profile management
const profile = await api.getProfile();
await api.updateProfile(profileData);
await api.changePassword(passwordData);

// Business operations
const businesses = await api.getAllBusinesses();
await api.registerBusiness(businessData);
```

For custom endpoints, use the configured axios client:

```javascript
const response = await apiClient.get('/custom/endpoint');
const postResponse = await apiClient.post('/custom/endpoint', data);
```

### Available Endpoints:

- **Authentication**: `/api/login`, `/api/register`, OAuth endpoints
- **Profile**: `/api/profile` (GET, PUT), `/api/profile/change-password`
- **Business**: `/api/business/register`, `/api/business/all`, `/api/business/{id}`

## Development

// ...existing README content...
