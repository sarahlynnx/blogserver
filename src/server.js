const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = require('./app');
connectDB();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
