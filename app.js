const express = require('express')
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config()

const eventsRoutes = require('./api/routes/events');
const bookingsRoutes = require('./api/routes/bookings');

//database connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error.message);
});

// Middleware for logging HTTP request && parsing incoming request bodies && handling CORS and setting response headers
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((error, req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});


// Routes for handling specific resource endpoints
app.use('/events', eventsRoutes);
app.use('/bookings', bookingsRoutes);


// Middleware for handling 404 (Not Found) errors
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;


