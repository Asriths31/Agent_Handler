# Agent Lead / Task Distribution MERN Application

This repository contains a full-stack MERN application for uploading lists of tasks (via CSV, XLS, or XLSX files) and automatically distributing them equally among registered agents using round-robin (modulo-based) logic.

## Technical Stack

- **Frontend**: React (Vite), Tailwind CSS, TanStack Query (React Query), Axios, React Icons, React Hot Toast.
- **Backend**: Node.js, Express, JavaScript (ES Modules), Mongoose, Multer (file uploads), csv-parser, xlsx (Excel/Spreadsheet parsing), JSON Web Tokens (JWT), bcryptjs.
- **Database**: MongoDB.

---

## Key Features

1. **Multi-Tenant User Isolation**: Data is partitioned dynamically. Registered users can only see, create, modify, and delete their own agents and tasks.
2. **Bloom Filter Username Check**: Utilizes a highly efficient, in-memory Bloom Filter to verify username uniqueness during registration. DB lookups are avoided entirely if the Bloom Filter guarantees the username does not exist.
3. **Excel/CSV Upload & Equal Round-Robin Distribution**: Upload leads via spreadsheets (CSV/XLS/XLSX) which are instantly parsed and distributed equally among active agents.
4. **Enhanced UI Forms**: Registration and login screens include dynamic required fields (`*`), password guidelines, and visibility toggles (Show/Hide password).
5. **Real-time Availability checking**: Username availability is verified dynamically as the user types using a 500ms debounced checking mechanism with a loading indicator.

---

## Project Structure

```
agentssss/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection setup
│   │   ├── controllers/     # Route handlers (auth, agent, task)
│   │   ├── middleware/      # JWT guards, Multer configuration
│   │   ├── models/          # User, Agent, Task mongoose models (partitioned by userId)
│   │   ├── routes/          # Express route endpoints
│   │   ├── services/        # File parsing & task distribution logic
│   │   ├── utils/           # Bloom Filter logic, migration helpers, response formatting
│   │   └── app.js           # Express app setup
│   │   └── server.js        # Startup entrypoint
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── seed.js              # Script to seed default Admin
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios client configuration and service definitions
│   │   ├── layouts/         # Dashboard shell and routing wrappers
│   │   ├── pages/           # Pages (Login, Dashboard, Agents, Upload, Tasks)
│   │   ├── routes/          # Public/Private routes and Auth Guards
│   │   ├── utils/           # LocalStorage auth helpers
│   │   ├── main.jsx         # React application entrypoint
│   │   └── index.css        # Tailwind global styles
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
├── sample_tasks.csv         # Sample CSV file for upload testing
└── README.md
```

---

## Flow of the Application

### 1. Authentication & Onboarding
- **Registration**: The user registers with a `username`, `email`, and `password`. The system performs a real-time debounced check on the username availability utilizing a backend Bloom Filter.
- **Login**: Authenticates the user and sets an HTTP-only JWT cookie. The username is cached on the frontend to render the user's name and initials dynamically in the header and sidebar.

### 2. Agent Management
- The user creates, reads, updates, or deletes agents.
- Since data is isolated by user, these agents are scoped exclusively to the logged-in user (`userId: req.user._id`).

### 3. Task Sheet Upload & Distribution
- **Upload**: The user uploads a spreadsheet containing task rows (`FirstName`, `Phone`, `Notes`).
- **Parsing**: The backend uses the **`xlsx`** library to parse Excel spreadsheets or the **`csv-parser`** library to stream CSV files.
- **Validation**: Checks for missing fields, bad phone numbers (must be exactly 10 digits), and duplicates within the batch or within the user's database. If any errors are found, the backend returns an error Excel file containing row-by-row validation logs.
- **Distribution**: If all rows are valid, tasks are distributed among the user's agents using an equal round-robin algorithm.

---

## Spreadsheet / Excel Handling Libraries

For spreadsheet parsing and verification, the backend utilizes:
- **`xlsx` (SheetJS)**:
  - Handles parsing `.xlsx` and `.xls` binary formats.
  - Converts sheets to JSON objects via `xlsx.utils.sheet_to_json`.
  - Generates feedback validation spreadsheets using `xlsx.utils.json_to_sheet` and `xlsx.write` to send errors back as a downloadable `.xlsx` file.
- **`csv-parser`**:
  - A streamable CSV parser used to process large `.csv` files row-by-row with minimal memory usage.

---

## Setup and Installation

### Prerequisites
- Node.js (v16+)
- npm
- MongoDB Atlas connection string

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
   Open `backend/.env` and update `MONGO_URI` with your connection string.
4. Seed the default Admin user (`admin@example.com` / `admin125`):
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
