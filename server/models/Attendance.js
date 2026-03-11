const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: [true, 'Employee ID is required'],
            trim: true,
            uppercase: true,
        },
        date: {
            type: String,
            required: [true, 'Date is required'],
            match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
        },
        status: {
            type: String,
            required: [true, 'Attendance status is required'],
            enum: {
                values: ['Present', 'Absent'],
                message: '{VALUE} is not a valid status. Use Present or Absent.',
            },
        },
    },
    {
        timestamps: true,
    }
);

// Compound unique index: one attendance record per employee per day
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ employeeId: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
