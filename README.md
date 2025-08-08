# 🏠 FlowCRM - Property Management CRM

> **[🌟 Live Demo](https://costasford.github.io/FlowCRM)** | Interactive property management system with no signup required!

A comprehensive **Property Management CRM** system built specifically for property managers and real estate professionals. Features a drag & drop Kanban board, tenant management, maintenance tracking, and property analytics.

Built with **Node.js, Express, PostgreSQL, React, and Tailwind CSS**.

---

## 🚀 Quick Demo

**Try it now:** **https://costasford.github.io/FlowCRM**

- ✨ **No signup required** - Interactive demo with realistic data
- 📱 **Mobile responsive** - Perfect for property managers in the field
- 🏢 **Property-focused** - Built specifically for real estate management

---

## Tech Stack

- **Backend:** Node.js, Express, PostgreSQL, Sequelize ORM
- **Frontend:** React (Vite), Tailwind CSS, Axios
- **Auth:** JWT authentication with bcrypt
- **Database:** PostgreSQL with Sequelize migrations

## Features

### Core Property Management
- 🏢 **Property/Company Management** - Track properties, buildings, and real estate companies
- 👥 **Contact Management** - Manage tenants, property owners, vendors, and prospects
- 💰 **Deal Pipeline** - Track leases, renewals, maintenance contracts with Kanban board
- ✅ **Task Management** - Property maintenance, inspections, follow-ups with priority levels
- 📈 **Lead Scoring** - Automatic scoring for property management prospects
- 📝 **Activity Logging** - Track all interactions, calls, emails, and property visits

### Property Management Focused Features
- 🔧 **Maintenance Tracking** - Property-specific maintenance tasks and contracts
- 📋 **Tenant Management** - Lease tracking, renewal management, tenant communications
- 🏗️ **Multi-Property Support** - Manage multiple properties and buildings
- 📊 **Property Analytics** - Revenue tracking, occupancy rates, deal values
- 🎯 **Property-Specific Tags** - Commercial, residential, multi-unit, high-value classifications
- 💼 **Role-Based Access** - Admin, Property Manager, and Leasing Agent permissions

### Technical Features
- 🔐 **JWT Authentication** - Secure login with role-based permissions
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔍 **Advanced Search & Filtering** - Find properties, contacts, and deals quickly
- 📈 **Dashboard Analytics** - Real-time insights into property management metrics

---

## 🚀 Deployment Options

### **🌟 Live Demo (GitHub Pages)**
**URL**: https://costasford.github.io/FlowCRM  
**Purpose**: Portfolio showcase, client demos, skill demonstration  
**Features**: Interactive frontend with realistic demo data

### **🏢 Production API (Railway)**
**Branch**: `railway-backend`  
**Purpose**: Real business application with persistent database  
**Features**: Full PostgreSQL backend, JWT authentication, team collaboration

### **⚡ Quick Railway Deployment:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Switch to backend-only branch
git checkout railway-backend

# Deploy in 2 minutes
railway login && railway link && railway up
```

**See [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md) for detailed production setup.**

---

## Quick Start

### Prerequisites

- Node.js (v18+)
- PostgreSQL (v12+)
- npm or yarn

### Setup

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/costasford/FlowCRM.git
   cd FlowCRM
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   cd ..
   ```

2. **Setup PostgreSQL Database**
   ```bash
   # Create database
   createdb flowcrm_dev
   ```

3. **Configure Environment Variables**
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials and JWT secret
   
   # Frontend  
   cd ../frontend
   cp .env.example .env
   # Edit .env with your API URL
   ```

4. **Run Database Migrations & Seeds**
   ```bash
   cd backend
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

5. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend (port 5000)
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend (port 3000)  
   cd frontend
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## Demo Accounts

After running the seeders, you can log in with these demo accounts:

- **Admin:** admin@flowcrm.com / admin123
- **Property Manager:** manager@flowcrm.com / manager123  
- **Leasing Agent:** agent@flowcrm.com / user123

## Project Structure

### **Repository Branches:**
- **`main`**: Full-stack development (frontend + backend)
- **`railway-backend`**: Production API deployment (backend only)

### **Main Branch Structure:**
```
FlowCRM/ (main branch - full development)
├── backend/               # Express API server
│   ├── config/           # Database configuration
│   ├── middleware/       # JWT authentication
│   ├── models/          # Sequelize models
│   ├── routes/          # API endpoints
│   ├── migrations/      # Database schema
│   └── seeders/         # Sample data
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Route pages
│   │   ├── utils/       # API utilities
│   │   └── contexts/    # Auth context
│   └── package.json
└── README.md
```

### **Railway Branch Structure:**
```
FlowCRM/ (railway-backend branch - production)
├── package.json         # Backend dependencies only
├── server.js           # Express server
├── .dockerignore       # Excludes frontend from builds
├── config/             # Database config
├── models/             # Property management models
├── routes/             # API endpoints
├── migrations/         # Database setup
└── seeders/            # Sample property data
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### CRUD Endpoints
- `GET/POST/PUT/DELETE /api/contacts` - Contact management
- `GET/POST/PUT/DELETE /api/companies` - Company management
- `GET/POST/PUT/DELETE /api/deals` - Deal management
- `GET/POST/PUT/DELETE /api/activities` - Activity logging
- `GET/POST/PUT/DELETE /api/tasks` - Task management
- `GET/POST/PUT/DELETE /api/users` - User management
- `GET/POST/PUT/DELETE /api/leadscores` - Lead scoring

## Development

### Backend Scripts
- `npm run dev` - Start with nodemon
- `npm start` - Production start
- `npm run migrate` - Run migrations
- `npm run seed` - Run seeders

### Frontend Scripts  
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License
