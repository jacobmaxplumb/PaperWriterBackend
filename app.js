const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// For login
app.post('/api/login', (req, res) => {
    const user = {
        name: req.body.name,
        email: req.body.email
    };
    jwt.sign({ user }, 'secretKey', (err, token) => {
        res.json({
            token
        })
    })
});

app.use(verifyToken);

require('./routes')(app);

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(200).send({
    message: 'Welcome to the beginning of nothingness.',
}));

// Authorization Function
function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader !== undefined) {
        const token = bearerHeader.split(' ')[1];
        req.token = token;
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports = app;