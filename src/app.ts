import express, { Application } from 'express';
import messageRoutes from './routes/message.routes';
import cors from 'cors';
import path from 'path';

const app: Application = express();

// CORS Policy
app.use(cors({
    origin: "*",
}));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '../public')));

// Route to Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Middleware to parse JSON
app.use(express.json());

// API Routes
app.use('/api/v1', messageRoutes);

export default app;
