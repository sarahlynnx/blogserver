const express = require('express');
const app = express();
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

const allowedOrigins = process.env.ALLOWED_CORS_ORIGINS.split(',');
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || /^http?:\/\/localhost(:\d+)?$/.test(origin)) {
            return callback(null, true);
        } else {
            let msg = 'CORS does not allow access from this origin';
            return callback(new Error(msg), false);
        }
    }
}));


app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running.');
});

app.get('/api/maps-config', (req, res) => {
    const mapsAPIKey = process.env.GOOGLE_MAPS_API_KEY;
    const mapsAPIVersion = process.env.GOOGLE_MAPS_API_VERSION;
    const mapsURL = `https://maps.googleapis.com/maps/api/js?key=${mapsAPIKey}&v=${mapsAPIVersion}&callback=initMap&libraries=marker"`;
    res.json({ mapsURL });
});


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