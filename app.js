const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
app.use(morgan('dev'));

app.use(cors());
app.use(express.json());

const userRoute = require(`${__dirname}/routes/userRoutes`);
app.use('/api/auth', userRoute)

module.exports = app;