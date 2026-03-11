const express = require('express');
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const { validateAttendance } = require('../middleware/validate');

const router = express.Router();

/**
 * @route   POST /api/attendance
 * @desc    Mark attendance for an employee
 */
router.post('/', validateAttendance, async (req, res, next) => {
    try {
        const { employeeId, date, status } = req.body;

        // Verify the employee exists
        const employee = await Employee.findOne({
            employeeId: employeeId.toUpperCase(),
        });

        if (!employee) {
            return res.status(404).json({
                success: false,
                error: `Employee with ID "${employeeId}" not found. Please add the employee first.`,
            });
        }

        // Check if attendance already exists for this employee on this date
        const existing = await Attendance.findOne({
            employeeId: employeeId.toUpperCase(),
            date,
        });

        if (existing) {
            // Update existing record
            existing.status = status;
            await existing.save();

            return res.json({
                success: true,
                message: `Attendance updated for ${employee.fullName} on ${date}.`,
                data: existing,
            });
        }

        // Create new attendance record
        const attendance = await Attendance.create({
            employeeId: employeeId.toUpperCase(),
            date,
            status,
        });

        res.status(201).json({
            success: true,
            message: `Attendance marked for ${employee.fullName} on ${date}.`,
            data: attendance,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/attendance
 * @desc    Get attendance records (filter by employee and/or date)
 */
router.get('/', async (req, res, next) => {
    try {
        const { employeeId, date, startDate, endDate } = req.query;
        const filter = {};

        if (employeeId) {
            filter.employeeId = employeeId.toUpperCase();
        }

        if (date) {
            filter.date = date;
        } else if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = startDate;
            if (endDate) filter.date.$lte = endDate;
        }

        const records = await Attendance.find(filter).sort({ date: -1, employeeId: 1 });

        // Enrich with employee names
        const employeeIds = [...new Set(records.map((r) => r.employeeId))];
        const employees = await Employee.find({ employeeId: { $in: employeeIds } });
        const employeeMap = {};
        employees.forEach((emp) => {
            employeeMap[emp.employeeId] = emp.fullName;
        });

        const enrichedRecords = records.map((record) => ({
            _id: record._id,
            employeeId: record.employeeId,
            employeeName: employeeMap[record.employeeId] || 'Unknown',
            date: record.date,
            status: record.status,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        }));

        res.json({
            success: true,
            count: enrichedRecords.length,
            data: enrichedRecords,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/attendance/summary
 * @desc    Get attendance summary (dashboard stats)
 */
router.get('/summary', async (req, res, next) => {
    try {
        const { date } = req.query;
        const today = date || new Date().toISOString().split('T')[0];

        const totalEmployees = await Employee.countDocuments();
        const departments = await Employee.distinct('department');

        const presentToday = await Attendance.countDocuments({
            date: today,
            status: 'Present',
        });
        const absentToday = await Attendance.countDocuments({
            date: today,
            status: 'Absent',
        });

        res.json({
            success: true,
            data: {
                totalEmployees,
                presentToday,
                absentToday,
                totalDepartments: departments.length,
                departments,
                date: today,
            },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/attendance/employee/:employeeId
 * @desc    Get attendance history for a specific employee
 */
router.get('/employee/:employeeId', async (req, res, next) => {
    try {
        const empId = req.params.employeeId.toUpperCase();

        const employee = await Employee.findOne({ employeeId: empId });
        if (!employee) {
            return res.status(404).json({
                success: false,
                error: `Employee with ID "${req.params.employeeId}" not found.`,
            });
        }

        const records = await Attendance.find({ employeeId: empId }).sort({ date: -1 });

        const presentDays = records.filter((r) => r.status === 'Present').length;
        const absentDays = records.filter((r) => r.status === 'Absent').length;

        res.json({
            success: true,
            data: {
                employee: {
                    employeeId: employee.employeeId,
                    fullName: employee.fullName,
                    email: employee.email,
                    department: employee.department,
                },
                summary: {
                    totalDays: records.length,
                    presentDays,
                    absentDays,
                },
                records,
            },
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
