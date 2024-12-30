const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');
require('dotenv').config();

const app = express();

const corsConfig = {
    origin: process.env.Client_URL || '*',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
};

// Middleware
app.use(express.json());
app.use(cors(corsConfig));

// Import the transactions router
app.use('/api/v1', require('./routes/transactions'));

// Database connection with error handling
const connectDB = async () => {
    try {
        await db();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        // Log the specific error details for debugging
        console.error('Error details:', error.message);
    }
};

// Initialize database connection
connectDB();

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log('Listening to port:', PORT);
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error occurred:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

module.exports = app;