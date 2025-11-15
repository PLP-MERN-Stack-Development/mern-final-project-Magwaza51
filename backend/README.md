# Task Management Backend API

Backend API for the Task Management System. For complete documentation, see the main [README.md](../README.md) in the root directory.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test
```

## Environment Variables

Create a `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests with Jest
- `npm run test:watch` - Run tests in watch mode

## API Endpoints

See the main README.md for complete API documentation.

**Base URL:** `http://localhost:5000/api`

- `/api/auth` - Authentication routes
- `/api/projects` - Project management
- `/api/tasks` - Task management
- `/api/health` - Health check

## Tech Stack

- Express.js - Web framework
- Mongoose - MongoDB ODM
- JWT - Authentication
- bcryptjs - Password hashing
- Socket.io - Real-time communication
- Jest & Supertest - Testing
