const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = { Attendance };