const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

const { User } = require('./models/user'); 

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

const mongoose = require('mongoose');
const URL_MONGO = 'mongodb://prueba:hola123@ds239940.mlab.com:39940/checkin';

mongoose.connect(URL_MONGO, {useNewUrlParser: true}, function (err) {
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
            : res.send(user);
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

app.listen(port, () => {
    console.log(`Server on port: ${port}`);
});