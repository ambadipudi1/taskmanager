**📌 Task Manager App**

A full-stack Task Manager Web Application built using React (frontend) and Node.js + Express (backend) with a lightweight database for storing tasks.
It helps users efficiently create, manage, update, and delete tasks with authentication support.

**🚀 Key Highlights**
🔐 Secure User Authentication (Login / Register using JWT)
➕ Create Tasks instantly with simple UI
✏️ Update/Edit Tasks anytime
🗑️ Delete Tasks with one click
📋 Clean Dashboard to view all tasks
💾 Persistent storage using SQLite database
⚡ Fast REST API communication between frontend & backend
🎨 Responsive and clean React-based UI
🔄 Real-time task updates without page reload
**🧱 Tech Stack Overview**
**🖥️ Frontend**
React.js (UI Development)
JavaScript (ES6+)
HTML5 + CSS3
**⚙️ Backend**
Node.js (Server runtime)
Express.js (API framework)
SQLite (Lightweight database)
JWT (Authentication)
**📁 Project Architecture**
Modular frontend structure (components + pages)
REST API-based backend
Secure authentication flow
File-based lightweight database (tasks.db)
**⚙️ Setup in Simple Steps**
**1️⃣ Clone Project**
git clone https://github.com/your-username/taskmanager.git
cd taskmanager
**2️⃣ Start Backend Server**
cd backend
npm install
node server.js

📍 Runs on: http://localhost:5000

**3️⃣ Start Frontend**
cd frontend
npm install
npm start

📍 Runs on: http://localhost:3000

**🔗 API Highlights**
🔑 Authentication: /register, /login
📌 Task Management:
GET /tasks → Fetch all tasks
POST /tasks → Add task
PUT /tasks/:id → Update task
DELETE /tasks/:id → Remove task
🎯 Future Enhancements
☁️ Cloud database integration (MongoDB / PostgreSQL)
📅 Task deadlines & reminders
🏷️ Priority-based task system
🎯 Drag & drop task sorting
📱 Fully mobile-optimized UI
**Demo:**
