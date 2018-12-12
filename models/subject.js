const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    name: String,
    description: String,
    students: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
    },
}, { timestamps: true });

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = { Subject };