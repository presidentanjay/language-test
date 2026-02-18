const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { prisma } = require('./lib/prisma');

dotenv.config();

const app = express();
const port = process.env.API_PORT || 3001;

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'TOEFL Backend API is running' });
});

// Import and use routes
const examRoutes = require('./routes/exams');
const userRoutes = require('./routes/users');
const questionRoutes = require('./routes/questions');

app.use('/api/exams', examRoutes);
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);

app.listen(port, () => {
    console.log(`Backend API listening at http://localhost:${port}`);
});
