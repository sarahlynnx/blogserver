const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = require('./app');
connectDB();

app.use(express.json({ extended: false }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
