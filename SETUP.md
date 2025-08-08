# FlowCRM - Complete Setup Guide

This guide will walk you through setting up FlowCRM for development or production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Running the Application](#running-the-application)
6. [Development Workflow](#development-workflow)
7. [Production Deployment](#production-deployment)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Node.js** (v18.0.0 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify: `node --version`

- **PostgreSQL** (v12.0 or higher)
  - Download from [postgresql.org](https://www.postgresql.org/download/)
  - Verify: `psql --version`

- **npm** (comes with Node.js)
  - Verify: `npm --version`

- **Git** (for cloning the repository)
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify: `git --version`

### Optional but Recommended

- **pgAdmin** - PostgreSQL administration tool
- **Postman** - API testing tool
- **VS Code** - Code editor with PostgreSQL and React extensions

## Database Setup

### 1. Install PostgreSQL

1. Download and install PostgreSQL from the official website
2. During installation, remember the password for the `postgres` user
3. Make sure PostgreSQL service is running

### 2. Create Database

Option A: Using psql command line
```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE flowcrm_dev;

# Create test database (optional)
CREATE DATABASE flowcrm_test;

# Exit psql
\q
```

Option B: Using pgAdmin
1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click "Databases" → "Create" → "Database..."
4. Name: `flowcrm_dev`
5. Click "Save"

### 3. Verify Database Connection

```bash
psql -U postgres -d flowcrm_dev -c "SELECT version();"
```

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit the .env file with your settings
# Use your preferred text editor
code .env  # VS Code
# or
nano .env  # Linux/Mac
# or
notepad .env  # Windows
```

**Required Environment Variables:**

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=flowcrm_dev
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Origins
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 4. Test Database Connection

```bash
# Test connection with a simple query
npm run test-db
```

If this fails, verify your database credentials in the `.env` file.

### 5. Run Database Migrations

```bash
# Install Sequelize CLI globally (if not already installed)
npm install -g sequelize-cli

# Run migrations to create tables
npm run migrate

# Alternative method
npx sequelize-cli db:migrate
```

### 6. Seed Sample Data

```bash
# Run seeders to populate with demo data
npm run seed

# Alternative method
npx sequelize-cli db:seed:all
```

### 7. Start Backend Server

```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

The backend should now be running at `http://localhost:3001`

### 8. Verify Backend

Test the API:
```bash
# Health check
curl http://localhost:3001/api/auth/health

# Or visit in browser
http://localhost:3001/api
```

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd ../frontend  # From backend directory
# or
cd frontend     # From project root
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit the .env file
code .env
```

**Frontend Environment Variables:**

```env
VITE_API_URL=http://localhost:3001/api
```

### 4. Start Frontend Development Server

```bash
npm run dev
```

The frontend should now be running at `http://localhost:5173`

## Running the Application

### Development Mode

You'll need two terminal windows/tabs:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Access the Application

1. Open your browser
2. Go to `http://localhost:5173`
3. Use the demo login credentials:

   - **Admin:** admin@flowcrm.com / admin123
   - **Manager:** manager@flowcrm.com / manager123
   - **Agent:** agent@flowcrm.com / user123

## Development Workflow

### Common Development Tasks

**Backend Development:**
```bash
# Run in development mode with auto-reload
npm run dev

# Run database migrations
npm run migrate

# Undo last migration
npm run migrate:undo

# Run specific seeder
npx sequelize-cli db:seed --seed 001-admin-user.js

# Reset database (warning: destroys all data)
npm run db:reset
```

**Frontend Development:**
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Database Management

**Create New Migration:**
```bash
cd backend
npx sequelize-cli migration:generate --name add-new-feature
```

**Create New Seeder:**
```bash
npx sequelize-cli seed:generate --name demo-data
```

**Backup Database:**
```bash
pg_dump -U postgres -d flowcrm_dev > backup.sql
```

**Restore Database:**
```bash
psql -U postgres -d flowcrm_dev < backup.sql
```

## Production Deployment

### Backend Deployment

1. **Environment Setup:**
   ```env
   NODE_ENV=production
   DATABASE_URL=your_production_database_url
   JWT_SECRET=strong_production_secret_key
   PORT=3001
   ```

2. **Build and Start:**
   ```bash
   npm install --only=production
   npm run migrate
   npm start
   ```

### Frontend Deployment

1. **Build:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder to your hosting service**

### Environment Variables for Production

**Backend (.env):**
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/dbname
JWT_SECRET=very-secure-secret-key-for-production
PORT=3001
CORS_ORIGINS=https://your-domain.com
DB_SSL=true
```

**Frontend (.env):**
```env
VITE_API_URL=https://your-api-domain.com/api
```

## Troubleshooting

### Common Issues

**1. Database Connection Failed**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

**2. Migration Errors**
```
ERROR: relation "Users" does not exist
```
- Run migrations: `npm run migrate`
- Check if database is properly set up

**3. Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::3001
```
- Kill process using the port: `lsof -ti:3001 | xargs kill -9`
- Or change PORT in `.env` file

**4. Frontend API Connection Issues**
```
Network Error / CORS Error
```
- Verify backend is running
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS settings in backend

**5. JWT Authentication Issues**
```
jwt must be provided / jwt malformed
```
- Clear browser localStorage
- Check JWT_SECRET in backend `.env`
- Re-login to get new token

### Reset Everything

If you need to start fresh:

```bash
# Backend
cd backend
npm run db:reset  # This will drop and recreate everything
npm run migrate
npm run seed

# Frontend
cd ../frontend
rm -rf node_modules
npm install
```

### Getting Help

1. **Check the logs** - Backend logs will show detailed error messages
2. **Browser Developer Tools** - Check Console and Network tabs
3. **Database logs** - Check PostgreSQL logs for database issues
4. **GitHub Issues** - Report bugs or ask questions

### Useful Commands

```bash
# Check if services are running
lsof -i :3001  # Backend
lsof -i :5173  # Frontend
lsof -i :5432  # PostgreSQL

# View recent logs
tail -f backend/logs/app.log

# Check database contents
psql -U postgres -d flowcrm_dev -c "SELECT * FROM \"Users\";"
```

## Next Steps

After successful setup:

1. **Explore the Application** - Log in with demo accounts
2. **Read the API Documentation** - Check `/docs` endpoint (if implemented)
3. **Customize for Your Needs** - Modify models, routes, and frontend components
4. **Set up Testing** - Run `npm test` in both frontend and backend
5. **Configure Production Environment** - Set up proper hosting and database

For more detailed documentation, see the main README.md file.