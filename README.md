# FlowCRM

A comprehensive Property Management CRM system built specifically for property managers and real estate professionals. Built with Node.js, Express, PostgreSQL, React, and Tailwind CSS.

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

## Quick Start

### Prerequisites

- Node.js (v18+)
- PostgreSQL (v12+)
- npm or yarn

### Setup

1. **Clone and install dependencies**
   ```bash
   git clone <repo-url>
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

```
FlowCRM/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seeders/
│   ├── migrations/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── utils/
│   └── package.json
└── README.md
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