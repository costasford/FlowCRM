# FlowCRM - Property Management CRM

A modern, full-stack Customer Relationship Management system designed for property management professionals.

**[🌟 Live Demo](https://costasford.github.io/FlowCRM)** - Production-ready CRM with real backend!

### 🔐 Authentication
This is a **production application** with real user registration and authentication. Create your account to get started:

1. Visit the [Live Demo](https://costasford.github.io/FlowCRM)
2. Click "Register" to create a new account
3. Login with your credentials to access the full CRM system

**No demo accounts needed** - this is the real application ready for use!

## Features

### 🏠 Property Management
- **Contact Management** - Track leads, clients, and property owners
- **Company Database** - Manage property management companies and contractors  
- **Deal Pipeline** - Visual kanban board for tracking property transactions
- **Task Management** - Assign and track follow-up tasks
- **Activity Timeline** - Complete audit trail of all interactions

### 🔐 Security & Authentication
- **JWT Tokens** - Secure localStorage-based authentication for cross-domain support
- **Bearer Token Authorization** - All API requests authenticated with JWT tokens
- **Cross-Domain Compatible** - Frontend (GitHub Pages) + Backend (Railway) architecture
- **Role-based Access Control** - Admin, Manager, and User permissions
- **Rate Limiting** - Protection against brute force attacks
- **CORS Security** - Properly configured for GitHub Pages ↔ Railway communication
- **Input Validation** - Comprehensive data sanitization and validation

### 📱 Professional User Experience  
- **Enterprise-grade Error Handling** - User-friendly error messages and recovery
- **Real-time Connection Testing** - Automatic server connectivity verification
- **Professional Loading States** - Smooth transitions and user feedback
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Intuitive Interface** - Clean, professional UI with Tailwind CSS
- **Drag-and-Drop Pipeline** - Visual deal management with real-time updates

## Technology Stack

### Frontend
- **React** - Modern JavaScript framework
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend  
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **Sequelize** - Object-relational mapping (ORM)
- **JWT** - JSON Web Tokens for authentication

### Infrastructure & Deployment
- **Railway** - Cloud platform for backend + PostgreSQL database
- **GitHub Pages** - Frontend hosting with cross-domain authentication
- **localStorage JWT** - Cross-domain compatible authentication strategy
- **Automated CI/CD** - Deploy frontend via `npm run deploy`
- **Database Migrations** - Automated schema management

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/costasford/FlowCRM.git
   cd FlowCRM
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Configure your .env file with database credentials
   npm run migrate
   npm run seed
   npm run dev
   ```

3. **Frontend Setup** 
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Register a new account or use existing credentials

## Production Deployment

FlowCRM uses a **cross-domain architecture** optimized for production:

- **Frontend**: GitHub Pages hosting at [https://costasford.github.io/FlowCRM](https://costasford.github.io/FlowCRM)
- **Backend**: Railway hosting at `https://flowcrm-production-1465.up.railway.app`  
- **Database**: Railway PostgreSQL with automated migrations
- **Authentication**: localStorage JWT tokens for cross-domain compatibility

### Deployment Commands
```bash
# Frontend deployment (from frontend/ directory)
npm run build:production  # Builds with Railway API URL
npm run deploy           # Deploys to GitHub Pages

# Backend is auto-deployed to Railway on git push
```

### Architecture Notes
- **Cross-domain authentication** handled via localStorage JWT tokens
- **CORS configured** for GitHub Pages ↔ Railway communication  
- **No cookies** - avoids SameSite restrictions across domains
- **Bearer token** authorization on all API requests

## API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration  
- `GET /api/users/me` - Get current user profile

### Core Resources
- `GET|POST /api/contacts` - Contact management
- `GET|POST /api/companies` - Company management
- `GET|POST /api/deals` - Deal pipeline management
- `GET|POST /api/tasks` - Task management
- `GET|POST /api/activities` - Activity timeline

All endpoints use **Bearer token authentication** with JWT tokens stored in localStorage. CORS is configured for GitHub Pages ↔ Railway cross-origin requests.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support or questions about FlowCRM, please open an issue in this repository.

---

Built with ❤️ for modern property management professionals