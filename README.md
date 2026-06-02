# Agent Lead / Task Distribution MERN Application

This repository contains a full-stack MERN application for uploading lists of tasks (via CSV, XLS, or XLSX files) and automatically distributing them equally among registered agents using round-robin (modulo-based) logic.

## Technical Stack

- **Frontend**: React (Vite), Tailwind CSS, TanStack Query (React Query), Axios, React Icons, React Hot Toast.
- **Backend**: Node.js, Express, JavaScript (ES Modules), Mongoose, Multer (file uploads), csv-parser, xlsx (Excel parsing), JSON Web Tokens (JWT), bcryptjs.
- **Database**: MongoDB.

---

## Project Structure

```
agentssss/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection
│   │   ├── controllers/     # Route request handlers
│   │   ├── middleware/      # JWT auth guard, Multer file upload
│   │   ├── models/          # User, Agent, Task models
│   │   ├── routes/          # Express API route bindings
│   │   ├── services/        # File parsing, task distribution logic
│   │   ├── utils/           # Standardized response helper
│   │   └── app.js           # App setup
│   │   └── server.js        # Server listener
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── seed.js              # Script to seed default Admin
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios client configuration and service calls
│   │   ├── layouts/         # Page navigation wrapper
│   │   ├── pages/           # Login, Dashboard, Agents, Upload, Tasks
│   │   ├── routes/          # Public/Private routes and Auth Guard
│   │   ├── utils/           # LocalStorage token helper
│   │   ├── main.jsx         # App entrypoint
│   │   └── index.css        # Tailwind global styling
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
├── sample_tasks.csv         # Sample CSV file for upload testing
└── README.md
```

---

## Setup and Installation

### Prerequisites
- Node.js (v16+)
- npm
- MongoDB running locally or an Atlas connection string

### 1. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the Environment Variables:
   Open `backend/.env` and update the `MONGO_URI` with your connection string if needed.
4. Seed the default Admin user (`admin@example.com` / `admin123`):
   ```bash
   npm run seed
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend server will run on `http://localhost:5000`.

### 2. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend Vite development server:
   ```bash
   npm run dev
   ```
   The frontend application will start on `http://localhost:5173`.

---

## Distribution Logic Details

The distribution engine implements an equal round-robin modulo-based assignment.
1. When a task sheet is uploaded, the service queries all active agents from the database sorted by registration date (`createdAt` ASC).
2. If there are $M$ agents and $N$ tasks, each task at index $i$ is assigned to agent at index:
   $$\text{assignedAgent} = \text{agents}[i \pmod M]$$
3. This guarantees that all agents receive an equal load of leads. For example:
   - 27 tasks distributed to 5 agents:
     - Agent 1 receives 6 tasks
     - Agent 2 receives 6 tasks
     - Agent 3 receives 5 tasks
     - Agent 4 receives 5 tasks
     - Agent 5 receives 5 tasks
