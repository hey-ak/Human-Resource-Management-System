# HRMS Lite — Human Resource Management System

A lightweight, full-stack HRMS application for managing employee records and tracking daily attendance. Built as a professional-grade internal HR tool.

![Tech Stack](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![Express.js](https://img.shields.io/badge/Express.js-4-green?logo=express) ![MongoDB](https://img.shields.io/badge/MongoDB-8-green?logo=mongodb)

---

## ✨ Features

- View present/absent summary counts
- Duplicate attendance handling (updates existing record)

### ✨ Bonus & Enhancements
- **User Authentication**: Secure Login/Sign Up system with JWT & HttpOnly cookies (Exceeds requirements)
- **Dashboard**: Real-time summary stats (total employees, present/absent today, departments)
- **Responsive Design**: Polished mobile-first UI with sticky header and hamburger menu
- **Advanced Filtering**: Search and filter by department, date, or employee ID
- **Developer Indicators**: Hidden Next.js dev indicators for a premium production feel

### UI/UX
- Professional, production-ready design with clean corporate theme
- Loading skeletons for data states
- Empty states with call-to-action buttons
- Error states with retry functionality
- Toast notifications for all actions
- Fully responsive layout
- Form validation with inline error messages

---

## 🛠️ Tech Stack

| Layer | Technology |
|----------|-----------|
| Frontend | Next.js 14 (App Router), React |
| Styling | Vanilla CSS (custom design system with CSS variables) |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Validation | express-validator |
| Font | Inter (Google Fonts) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ 
- **MongoDB** running locally or a MongoDB Atlas URI

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd HumanResourceManagemntSystem
```

### 2. Set up the Backend
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/hrms_lite
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
```

The API will be available at `http://localhost:5001`.

### 3. Set up the Frontend
```bash
cd client
npm install
```

Create a `.env.local` file in the `client/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

Start the frontend:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## 📡 API Endpoints

### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | List all employees (supports `?search=` and `?department=`) |
| GET | `/api/employees/:id` | Get a single employee |
| POST | `/api/employees` | Create a new employee |
| DELETE | `/api/employees/:id` | Delete an employee |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/attendance` | Mark/update attendance |
| GET | `/api/attendance` | Get records (supports `?date=`, `?employeeId=`) |
| GET | `/api/attendance/summary` | Dashboard summary stats |
| GET | `/api/attendance/employee/:id` | Employee attendance history |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |

---

## 📂 Project Structure

```
HumanResourceManagemntSystem/
├── server/                     # Backend
│   ├── config/db.js            # MongoDB connection
│   ├── models/
│   │   ├── Employee.js         # Employee schema
│   │   └── Attendance.js       # Attendance schema
│   ├── routes/
│   │   ├── employeeRoutes.js   # Employee API routes
│   │   └── attendanceRoutes.js # Attendance API routes
│   ├── middleware/
│   │   ├── errorHandler.js     # Centralized error handling
│   │   └── validate.js         # Input validation rules
│   └── index.js                # Express app entry point
├── client/                     # Frontend
│   ├── app/
│   │   ├── layout.js           # Root layout with sidebar
│   │   ├── page.js             # Dashboard page
│   │   ├── globals.css         # Design system & styles
│   │   ├── employees/page.js   # Employee management page
│   │   └── attendance/page.js  # Attendance tracking page
│   ├── components/
│   │   ├── Sidebar.js          # Navigation sidebar
│   │   ├── Modal.js            # Reusable modal overlay
│   │   ├── Toast.js            # Toast notification system
│   │   ├── StatCard.js         # Dashboard stat card
│   │   ├── AddEmployeeForm.js  # Employee creation form
│   │   └── MarkAttendanceForm.js # Attendance form
│   └── lib/api.js              # API client
└── README.md
```

---

## ⚠️ Assumptions & Limitations

- **Single admin user** — no authentication/authorization is implemented as per requirements
- **Leave management, payroll, and advanced HR features** are out of scope
- Attendance is tracked per-day per-employee (one record per combination)
- Departments are predefined (Engineering, Marketing, HR, Finance, Sales, Operations, Design, Product, Support)

---

## 🌐 Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | **Railway** |
| Database | MongoDB Atlas |

### Live URLs
- **Frontend**: [https://hrms-lite-frontend-blush.vercel.app/](https://hrms-lite-frontend-blush.vercel.app/)
- **Backend API**: [https://hrms-lite-backend-production-0159.up.railway.app](https://hrms-lite-backend-production-0159.up.railway.app)

---

## 📄 License

This project is for assignment evaluation purposes only.
