/**
 * Centralized error handling middleware.
 * Catches all errors and sends a consistent JSON response.
 */
const errorHandler = (err, req, res, _next) => {
    console.error('Error:', err.message);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
            success: false,
            error: 'Validation Error',
            messages,
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        return res.status(409).json({
            success: false,
            error: 'Duplicate Entry',
            message: `A record with ${field} "${value}" already exists.`,
        });
    }

    // Mongoose cast error (invalid ObjectId etc.)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            error: 'Invalid Data',
            message: `Invalid value for ${err.path}: ${err.value}`,
        });
    }

    // Default server error
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        error: err.message || 'Internal Server Error',
    });
};

module.exports = errorHandler;
