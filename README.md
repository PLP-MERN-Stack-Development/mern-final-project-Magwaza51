# 📋 Task Management System - MERN Stack Capstone Project

A full-stack collaborative task management application built with MongoDB, Express.js, React.js, and Node.js. This project features real-time updates, team collaboration, and comprehensive task tracking capabilities.

![Project Status](https://img.shields.io/badge/status-complete-brightgreen)
![Node Version](https://img.shields.io/badge/node-v22.17.1-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🎯 Project Overview

A real-time collaborative task management system where teams can create projects, manage tasks, assign team members, and track progress in real-time. Built as the final capstone project for the MERN Stack Development course.

### What This App Does

- **Manage Projects**: Create and organize multiple projects with team members
- **Track Tasks**: Use a Kanban-style board to manage tasks (To Do → In Progress → Done)
- **Collaborate in Real-time**: See updates instantly with Socket.io integration
- **Stay Organized**: Set priorities, due dates, and add comments to tasks
- **Monitor Progress**: View statistics and insights on your dashboard

## ✨ Key Features

### User Management
- ✅ User registration and authentication
- ✅ JWT-based secure authentication
- ✅ Password encryption with bcrypt
- ✅ User profile management

### Project Management
- ✅ Create, update, and delete projects
- ✅ Add/remove team members
- ✅ Project dashboard with statistics
- ✅ Project status tracking (Active, Completed, Archived)

### Task Management
- ✅ Create, update, and delete tasks
- ✅ Assign tasks to team members
- ✅ Task priority levels (Low, Medium, High)
- ✅ Task status tracking (Todo, In Progress, Done)
- ✅ Due date management
- ✅ Task comments and discussions

### Real-time Features
- ✅ Live task updates using Socket.io
- ✅ Real-time notifications
- ✅ Instant collaboration updates

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time communication
- **express-validator** - Input validation
- **Jest** & **Supertest** - Testing

### Frontend
- **React.js** - UI framework
- **React Router** - Navigation
- **Axios** - API calls
- **Socket.io-client** - Real-time updates
- **CSS Modules** - Styling
- **React Testing Library** - Testing

## 📁 Project Structure

```
mern-final-project-Magwaza51/
├── backend/
│   ├── models/          # Mongoose models
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/          # API routes
│   │   ├── auth.js
│   │   ├── projects.js
│   │   └── tasks.js
│   ├── middleware/      # Custom middleware
│   │   ├── auth.js
│   │   └── validate.js
│   ├── tests/          # Test files
│   │   └── auth.test.js
│   ├── server.js       # Entry point
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── context/     # Context API
│   │   └── App.js
│   └── package.json
├── PROJECT_PLAN.md     # Detailed project planning
├── Week8-Assignment.md # Assignment requirements
└── README.md

```

## 🚀 Quick Start Guide

### Prerequisites

- Node.js (v18 or higher) - [Download here](https://nodejs.org/)
- MongoDB Atlas account (free) - [Sign up here](https://www.mongodb.com/cloud/atlas)
- Git - [Download here](https://git-scm.com/)

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd mern-final-project-Magwaza51
```

### Step 2: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# The .env file is already configured with MongoDB Atlas
# But you can update it if needed:
# - MONGODB_URI (your MongoDB connection string)
# - JWT_SECRET (change for production)
# - PORT (default: 5000)
```

**Your backend `.env` file should look like this:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend folder (from project root)
cd frontend

# Install dependencies
npm install

# The .env file is already configured
# REACT_APP_API_URL=http://localhost:5000/api
```

### Step 4: Run the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
✅ Backend runs on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
```
✅ Frontend runs on `http://localhost:3000` (opens automatically)

### Step 5: Test the Application

1. Open your browser to `http://localhost:3000`
2. Click **"Get Started"** or **"Register"**
3. Create an account with your email and password
4. You'll be automatically logged in
5. Create your first project
6. Add tasks and move them through the board!

## 🎮 How to Use

### Creating Your First Project

1. After logging in, click **"Projects"** in the navbar
2. Click **"+ New Project"** button
3. Enter a project name and description
4. Click **"Create Project"**

### Managing Tasks

1. Click on a project to open it
2. Click **"+ New Task"** to create a task
3. Fill in task details:
   - Title (required)
   - Description
   - Priority (Low/Medium/High)
   - Due Date
4. Tasks appear in the **"To Do"** column
5. Use the dropdown on each task to move it:
   - **To Do** → **In Progress** → **Done**

### Dashboard Overview

Your dashboard shows:
- Total number of projects
- Total tasks across all projects
- Tasks in progress
- Completed tasks
- Recent projects and assigned tasks

## 🏗️ Technical Architecture

### Database Schema

**User Model:**
- name, email, password (hashed with bcrypt)
- avatar, timestamps

**Project Model:**
- name, description, owner, members (array)
- status (active/completed/archived)
- timestamps

**Task Model:**
- title, description, project reference
- assignedTo, createdBy (user references)
- status (todo/in-progress/done)
- priority (low/medium/high)
- dueDate, comments (array)
- timestamps

### Real-time Events (Socket.io)

The application uses Socket.io for real-time collaboration:

**Server Events Emitted:**
- `projectCreated` - New project created
- `projectUpdated` - Project modified
- `projectDeleted` - Project removed
- `taskCreated` - New task added
- `taskUpdated` - Task modified
- `taskDeleted` - Task removed
- `commentAdded` - Comment added to task

**Client Events:**
- `joinProject` - Join project room for updates
- `leaveProject` - Leave project room

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |

**Example - Register User:**
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Project Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/projects` | Get all user projects | Yes |
| POST | `/api/projects` | Create new project | Yes |
| GET | `/api/projects/:id` | Get project by ID | Yes |
| PUT | `/api/projects/:id` | Update project | Yes |
| DELETE | `/api/projects/:id` | Delete project | Yes |
| POST | `/api/projects/:id/members` | Add member | Yes |
| DELETE | `/api/projects/:id/members/:userId` | Remove member | Yes |

**Example - Create Project:**
```bash
POST http://localhost:5000/api/projects
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Website Redesign",
  "description": "Redesign company website"
}
```

### Task Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | Get all user tasks | Yes |
| GET | `/api/tasks/project/:projectId` | Get project tasks | Yes |
| POST | `/api/tasks` | Create new task | Yes |
| GET | `/api/tasks/:id` | Get task by ID | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |
| POST | `/api/tasks/:id/comments` | Add comment | Yes |

**Example - Create Task:**
```bash
POST http://localhost:5000/api/tasks
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Design homepage mockup",
  "description": "Create initial design for new homepage",
  "project": "project-id-here",
  "priority": "high",
  "dueDate": "2025-11-30"
}
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                 # Run all tests
npm run test:watch      # Run tests in watch mode
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🌐 Deployment

### Backend Deployment (Render/Railway)
1. Create account on Render or Railway
2. Connect GitHub repository
3. Set environment variables
4. Deploy backend service

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy to Vercel or Netlify
3. Update API URL in frontend

### MongoDB Atlas Setup
1. Create free MongoDB Atlas account
2. Create cluster and database
3. Get connection string
4. Update MONGODB_URI in environment variables

## 📊 Project Progress

### ✅ Completed Features

**Backend (100%)**
- ✅ Express.js server with Socket.io
- ✅ MongoDB Atlas database integration
- ✅ User authentication (JWT + bcrypt)
- ✅ 3 Mongoose models (User, Project, Task)
- ✅ 15+ RESTful API endpoints
- ✅ Real-time updates with Socket.io
- ✅ Input validation & error handling
- ✅ Security (Helmet, CORS)
- ✅ Test suite with Jest & Supertest

**Frontend (100%)**
- ✅ React app with routing (React Router)
- ✅ Authentication pages (Login/Register)
- ✅ Dashboard with statistics
- ✅ Projects management
- ✅ Kanban-style task board
- ✅ Context API for state management
- ✅ API service layer
- ✅ Responsive design & styling
- ✅ Modal forms for creating projects/tasks

**Documentation (100%)**
- ✅ Comprehensive README
- ✅ API documentation
- ✅ Setup instructions
- ✅ Code comments

### 🎯 Next Steps for Deployment

1. **Deploy Backend** (Render/Railway)
   - Create account on [Render](https://render.com) or [Railway](https://railway.app)
   - Connect GitHub repository
   - Set environment variables (MONGODB_URI, JWT_SECRET, etc.)
   - Deploy backend service

2. **Deploy Frontend** (Vercel/Netlify)
   - Create account on [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
   - Connect GitHub repository
   - Update `REACT_APP_API_URL` to deployed backend URL
   - Deploy frontend

3. **Create Video Demonstration**
   - Record 5-10 minute video showing:
     - Registration and login
     - Creating a project
     - Adding and managing tasks
     - Real-time features
     - Technical architecture overview

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**For Production:** Update `CLIENT_URL` in backend and `REACT_APP_API_URL` in frontend to your deployed URLs.

## 🐛 Troubleshooting

### Common Issues

**Issue: MongoDB connection error**
- Solution: Check your MongoDB Atlas connection string and ensure IP address is whitelisted

**Issue: Port 5000 already in use**
- Solution: Change PORT in backend `.env` file to different port (e.g., 5001)

**Issue: CORS errors**
- Solution: Ensure `CLIENT_URL` in backend `.env` matches your frontend URL

**Issue: JWT token invalid**
- Solution: Make sure to include token in Authorization header: `Bearer <token>`

**Issue: Frontend can't connect to backend**
- Solution: Verify both servers are running and `REACT_APP_API_URL` is correct

### Testing the Backend API

You can test the API using:
- **Postman** - Download from [postman.com](https://www.postman.com/)
- **Thunder Client** - VS Code extension
- **curl** commands in terminal

**Example Test:**
```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## 📄 License

This project is licensed under the MIT License - free to use for educational purposes.

## 👨‍💻 Author

**Mlungisi Magwaza**
- GitHub: [@Magwaza51](https://github.com/Magwaza51)
- Project: [mern-final-project-Magwaza51](https://github.com/PLP-MERN-Stack-Development/mern-final-project-Magwaza51)

## 🔗 Links

- **Live Demo**: Coming soon...
- **Video Demonstration**: Coming soon...
- **Assignment Requirements**: [Week8-Assignment.md](./Week8-Assignment.md)

## 🙏 Acknowledgments

- PLP MERN Stack Development Course
- MongoDB Atlas for database hosting
- All open-source libraries used in this project

## 📞 Support

For questions or issues:
- Open an issue in the GitHub repository
- Check the documentation above
- Review the assignment requirements in `Week8-Assignment.md`

---

**Built with ❤️ using the MERN Stack**

*This project demonstrates full-stack web development skills including database design, RESTful API development, real-time features, authentication, and modern frontend development.* 