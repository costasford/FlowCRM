# FlowCRM Frontend

Modern React frontend for the FlowCRM property management system.

## 🚀 Live Demo

**[https://costasford.github.io/FlowCRM](https://costasford.github.io/FlowCRM)**

### Demo Accounts
- **Admin**: admin@flowcrm.com / admin123
- **Manager**: manager@flowcrm.com / manager123  
- **Agent**: agent@flowcrm.com / user123

## 🛠️ Technology Stack

- **React 18** - Modern JavaScript framework with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing with protected routes
- **Axios** - HTTP client with interceptors and error handling
- **Heroicons** - Beautiful SVG icons

## 🏗️ Architecture

### Authentication System
- **HttpOnly Cookies** - Enterprise-grade XSS protection
- **JWT Tokens** - Secure authentication with automatic refresh
- **Protected Routes** - Route-level access control
- **Context API** - Centralized auth state management

### Professional Error Handling
- **Connection Testing** - Real-time server connectivity verification
- **User-friendly Messages** - Professional error messages instead of technical jargon
- **Network Error Recovery** - Automatic retry functionality
- **Loading States** - Professional feedback for all operations

### Smart API Layer
- **Automatic Demo/Production Switching** - Seamless environment handling
- **Comprehensive Error Mapping** - User-friendly error messages for all scenarios
- **CORS Configuration** - Proper cross-origin request handling
- **Request Timeouts** - 10-second timeout for better UX

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── common/          # Shared components
│   ├── deals/           # Deal management components
│   └── layout/          # Layout components
├── contexts/            # React Context providers
├── pages/               # Route-level page components
├── utils/               # Utility functions and API clients
├── App.jsx              # Main application component
└── main.jsx            # Application entry point
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Local: http://localhost:5173
   - Backend API: http://localhost:3001

### Build Commands

```bash
# Development build
npm run build

# Production build with API configuration
npm run build:production

# Demo mode build
npm run build:demo

# Deploy to GitHub Pages
npm run deploy
```

## 🔧 Configuration

### Environment Variables

- `VITE_API_URL` - Backend API base URL
- `VITE_DEMO_MODE` - Enable demo mode (true/false)

### Build Scripts

The build process automatically configures the correct API endpoints:

- **Development**: http://localhost:3001/api
- **Production**: https://flowcrm-production-1465.up.railway.app/api
- **Demo Mode**: Uses mock data instead of real API

## 🎨 UI/UX Features

### Professional Design
- **Consistent Design System** - Professional color scheme and typography
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **Loading States** - Smooth transitions and user feedback
- **Error Boundaries** - Graceful error handling

### User Experience
- **Real-time Validation** - Instant feedback on form inputs
- **Keyboard Shortcuts** - Power user features
- **Accessibility** - ARIA labels and keyboard navigation
- **Professional Animations** - Subtle micro-interactions

## 🔐 Security Features

### Client-side Security
- **HttpOnly Cookie Authentication** - XSS protection
- **CORS Compliance** - Proper cross-origin handling
- **Input Sanitization** - Client-side validation
- **Secure Route Protection** - Authentication-based navigation

## 📱 Responsive Design

FlowCRM frontend is fully responsive and tested on:

- **Desktop** - 1920x1080 and above
- **Laptop** - 1366x768 and above  
- **Tablet** - 768px and above
- **Mobile** - 375px and above

## 🛠️ Development

### Code Style
- **ESLint** - Code linting with React rules
- **Prettier** - Code formatting (configured in package.json)
- **Component Patterns** - Functional components with hooks
- **Error Boundaries** - Graceful error handling

### Performance
- **Code Splitting** - Dynamic imports for route-level splitting
- **Image Optimization** - Responsive images and lazy loading
- **Bundle Analysis** - Optimized build size
- **Caching** - Efficient browser caching strategies

## 📚 API Integration

### Smart API Layer
The frontend uses a smart API layer that automatically switches between demo and production modes:

```javascript
// Automatic environment detection
const api = createSmartAPI(realAPI, demoAPI);

// Professional error handling
error.userMessage // User-friendly error messages
```

### Authentication Flow
1. User logs in with credentials
2. Server sets HttpOnly cookie
3. All subsequent requests include cookie automatically
4. Client-side auth state managed via Context API

## 🚀 Deployment

### GitHub Pages (Current)
```bash
npm run deploy
```

This builds the production version and deploys to GitHub Pages with:
- **Production API URLs**
- **Optimized assets**
- **Proper CORS configuration**

### Alternative Deployment Options
- **Vercel** - Easy deployment with git integration
- **Netlify** - JAMstack deployment platform  
- **AWS S3** - Static website hosting
- **Railway** - Full-stack deployment platform

---

Built with ❤️ for modern property management professionals