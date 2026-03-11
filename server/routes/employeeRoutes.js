const express = require('express');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const { validateEmployee } = require('../middleware/validate');

const router = express.Router();

/**
 * @route   GET /api/employees
 * @desc    Get all employees (with optional search & department filter)
 */
router.get('/', async (req, res, next) => {
    try {
        const { search, department } = req.query;
        const filter = {};

        if (department) {
            filter.department = department;
        }

        if (search) {
            filter.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { employeeId: { $regex: search, $options: 'i' } },
            ];
        }

        const employees = await Employee.find(filter).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: employees.length,
            data: employees,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/employees/:employeeId
 * @desc    Get a single employee by employeeId
 */
router.get('/:employeeId', async (req, res, next) => {
    try {
        const employee = await Employee.findOne({
            employeeId: req.params.employeeId.toUpperCase(),
        });

        if (!employee) {
            return res.status(404).json({
                success: false,
                error: `Employee with ID "${req.params.employeeId}" not found.`,
            });
        }

        res.json({ success: true, data: employee });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/employees
 * @desc    Create a new employee
 */
router.post('/', validateEmployee, async (req, res, next) => {
    try {
        const { employeeId, fullName, email, department } = req.body;

        const employee = await Employee.create({
            employeeId,
            fullName,
            email,
            department,
        });

        res.status(201).json({
            success: true,
            message: 'Employee created successfully.',
            data: employee,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   DELETE /api/employees/:employeeId
 * @desc    Delete an employee and their attendance records
 */
router.delete('/:employeeId', async (req, res, next) => {
    try {
        const empId = req.params.employeeId.toUpperCase();

        const employee = await Employee.findOne({ employeeId: empId });

        if (!employee) {
            return res.status(404).json({
                success: false,
                error: `Employee with ID "${req.params.employeeId}" not found.`,
            });
        }

        // Cascade delete: remove all attendance records for this employee
        await Attendance.deleteMany({ employeeId: empId });
        await Employee.deleteOne({ employeeId: empId });

        res.json({
            success: true,
            message: `Employee "${employee.fullName}" and their attendance records have been deleted.`,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
