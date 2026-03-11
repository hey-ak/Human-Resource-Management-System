const { body, validationResult } = require('express-validator');

/**
 * Handles validation result from express-validator.
 * Returns 400 with error messages if validation fails.
 */
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation Error',
            messages: errors.array().map((e) => e.msg),
        });
    }
    next();
};

/**
 * Validation rules for user registration.
 */
const validateRegister = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 50 })
        .withMessage('Name cannot exceed 50 characters'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    handleValidation,
];

/**
 * Validation rules for user login.
 */
const validateLogin = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidation,
];

/**
 * Validation rules for creating an employee.
 */
const validateEmployee = [
    body('employeeId')
        .trim()
        .notEmpty()
        .withMessage('Employee ID is required')
        .isLength({ min: 1, max: 20 })
        .withMessage('Employee ID must be between 1 and 20 characters'),
    body('fullName')
        .trim()
        .notEmpty()
        .withMessage('Full name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Full name must be between 2 and 100 characters'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('department')
        .trim()
        .notEmpty()
        .withMessage('Department is required'),
    handleValidation,
];

/**
 * Validation rules for marking attendance.
 */
const validateAttendance = [
    body('employeeId')
        .trim()
        .notEmpty()
        .withMessage('Employee ID is required'),
    body('date')
        .trim()
        .notEmpty()
        .withMessage('Date is required')
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage('Date must be in YYYY-MM-DD format'),
    body('status')
        .trim()
        .notEmpty()
        .withMessage('Status is required')
        .isIn(['Present', 'Absent'])
        .withMessage('Status must be either Present or Absent'),
    handleValidation,
];

module.exports = { validateRegister, validateLogin, validateEmployee, validateAttendance };
