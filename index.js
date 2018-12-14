const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3001;

const QREncode = require('qrcode');
const { User } = require('./models/user');
const { Subject } = require('./models/subject');
const { Attendance } = require('./models/attendance');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

const mongoose = require('mongoose');
const URL_MONGO = 'mongodb://prueba:hola123@ds239940.mlab.com:39940/checkin';

mongoose.connect(URL_MONGO, { useNewUrlParser: true }, function (err) {
    if (err) {
        console.log('not conected ' + err);
    } else {
        console.log('sucessfully connected to mongodb');
    }
});

app.get('/', (req, res) => {
    res.send({ message: 'server on' });
});

app.post('/users', (req, res) => {
    const { username, password } = req.body;

    const newUser = User({
        username,
        password,
    });

    newUser.save((error, user) => {
        error
            ? res.status(409).send(error)
            : res.status(201).send(user);
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username, password }, (error, user) => {
        if (error) {
            res.status(409).send(error);
        }

        if (user) {
            res.send(user);
        } else {
            res.status(409).send('El usuario no existe.');
        }
    });
});

app.post('/subjects', (req, res) => {
    const { name, description } = req.body;

    const newSubject = Subject({
        name,
        description,
    });

    newSubject.save((error, subject) => {
        error
            ? res.status(409).send(error)
            : res.status(201).send(subject);
    });
});

app.get('/subjects', (req, res) => {
    Subject.find()
        .populate('students')
        .exec()
        .then(subjects => subjects ? res.send(subjects) : res.status(404).send({ message: 'Not found.' }))
        .catch(error => res.status(409).send(error));
});

app.get('/subjects/:id', (req, res) => {
    const { id } = req.params;

    Subject.findById(id)
        .populate('students')
        .exec()
        .then(subject => subject ? res.send(subject) : res.status(404).send({ message: 'Not found.' }))
        .catch(error => res.status(409).send(error));
});

app.put('/subjects/:id', (req, res) => {
    const { id } = req.params;
    const { user } = req.body;

    Subject.findOneAndUpdate(id, { $push: { students: user } })
        .exec()
        .then(subject => res.send(subject))
        .catch(error => res.status(409).send(error));
});

app.get('/generate', (req, res) => {

    const { text } = req.query;

    QREncode
        .toDataURL(text)
        .then((result) => { res.send(result) })
        .catch((error) => { res.send(error) })
});

app.post('/attendance', (req, res) => {
    const { subject, student } = req.body;
    
    const newAttendance = Attendance({
        subject,
        student,
    });
 
    newAttendance.save((error, attendance) => {
        error
            ? res.status(409).send(error)
            : res.status(201).send(attendance);
    });
});

app.get('/attendance', (req, res) => {
    Attendance.find()
        .populate('subject')
        .populate('student')
        .exec()
        .then(attendance => res.send(attendance))
        .catch(error => res.status(409).send(error));
});

app.listen(port, () => {
    console.log(`Server on port: ${port}`);
});