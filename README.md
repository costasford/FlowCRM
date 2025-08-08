# FlowCRM - Property Management CRM

A modern, full-stack Customer Relationship Management system designed for property management professionals.

**[🌟 Live Demo](https://costasford.github.io/FlowCRM)** - Try it now with no signup required!

## Features

### 🏠 Property Management
- **Contact Management** - Track leads, clients, and property owners
- **Company Database** - Manage property management companies and contractors  
- **Deal Pipeline** - Visual kanban board for tracking property transactions
- **Task Management** - Assign and track follow-up tasks
- **Activity Timeline** - Complete audit trail of all interactions

### 🔐 Security & Authentication
- JWT-based authentication with role-based access control
- Secure password hashing with bcrypt
- Rate limiting and CORS protection
- Input validation and SQL injection prevention

### 📱 Modern User Experience  
- Responsive design that works on desktop and mobile
- Clean, professional interface with Tailwind CSS
- Real-time updates and seamless navigation
- Intuitive drag-and-drop deal management

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
   - Backend API: http://localhost:5000
   - Login with: admin@flowcrm.com / admin123

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

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

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