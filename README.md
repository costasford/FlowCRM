# FlowCRM - Property Management CRM

A modern, full-stack Customer Relationship Management system designed for property management professionals.

**[🌟 Live Demo](https://costasford.github.io/FlowCRM)** - Try it now with demo accounts!

### 🔐 Demo Account
| Email | Password | Access Level |
|--------|----------|-------------|
| demo@flowcrm.com | password123 | Standard user access |

<details>
<summary>Additional Test Accounts (Development Only)</summary>

| Role | Email | Password | Access Level |
|------|--------|----------|-------------|
| **Admin** | admin@flowcrm.com | admin123 | Full system access |
| **Manager** | manager@flowcrm.com | manager123 | Property management |
| **Agent** | agent@flowcrm.com | user123 | Standard user access |

</details>

## Features

### 🏠 Property Management
- **Contact Management** - Track leads, clients, and property owners
- **Company Database** - Manage property management companies and contractors  
- **Deal Pipeline** - Visual kanban board for tracking property transactions
- **Task Management** - Assign and track follow-up tasks
- **Activity Timeline** - Complete audit trail of all interactions

### 🔐 Security & Authentication
- **HttpOnly Cookies** - Enterprise-grade XSS protection
- **JWT Authentication** - Secure token-based auth with automatic refresh
- **Role-based Access Control** - Admin, Manager, and User permissions
- **Rate Limiting** - Protection against brute force attacks
- **CORS Security** - Properly configured cross-origin resource sharing
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

### Infrastructure
- **Railway** - Cloud platform for backend deployment
- **GitHub Pages** - Frontend hosting
- **Automated migrations** - Database schema management

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
   - Login with demo accounts (see Demo Accounts section above)

## Production Deployment

FlowCRM is production-ready with automated deployment pipelines:

- **Live Demo**: [https://costasford.github.io/FlowCRM](https://costasford.github.io/FlowCRM)
- **API**: Deployed on Railway with PostgreSQL database
- **Frontend**: Deployed on GitHub Pages

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

All endpoints use HttpOnly cookie authentication for enhanced security. CORS is properly configured for cross-origin requests.

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