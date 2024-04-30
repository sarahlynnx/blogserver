const express = require('express');
const app = express();
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

app.use(cors());
app.use(express.json({ extended: false }));

app.use('/api/auth', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            details: err.details || 'An unexpected error occured'
        }
    });
});

module.exports = app;