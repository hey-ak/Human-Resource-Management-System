require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const employeeRoutes = require('./routes/employeeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'HRMS Lite API is running', timestamp: new Date().toISOString() });
});

// 404 handler for unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.method} ${req.originalUrl} not found.`,
    });
});

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 HRMS Lite server running on port ${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
