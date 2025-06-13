import serverless from 'serverless-http';
import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { fetchTasks, createTask, updateTask, deleteTask } from './task.js';

// Load .env variables
dotenv.config();

const app = express();
// For this Lambda deployment, we'll always use development settings
const allowedOrigins = process.env.CLIENT_URL?.split(',') || [];

// Middleware
app.use(helmet());                 // Security headers
app.use(express.json());           // JSON parsing
app.use(morgan('combined')); // HTTP logging

if(process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
    app.use(
        cors(
            { origin: (origin, callback) => {
                // Allow requests with no origin (e.g. Postman, mobile apps)
                if (!origin || allowedOrigins.includes(origin)) {
                    return callback(null, true);
                }
                return callback(new Error('CORS policy: origin not allowed'));
            }}
        )
    );
}

// app.use(
//     cors({ origin: (origin, callback) => {
//             // Allow requests with no origin (e.g. Postman, mobile apps)
//             if (!origin || allowedOrigins.includes(origin)) {
//                 return callback(null, true);
//             }
//             return callback(new Error('CORS policy: origin not allowed'));
//         } })
// );

// Async wrapper for error handling
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Healthcheck
app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});

// CRUD routes
app.get('/tasks', asyncHandler(async (req, res) => {
    const { items } = await fetchTasks();
    res.json(items);
}));

app.post('/tasks', asyncHandler(async (req, res) => {
    const newTask = await createTask(req.body);
    res.status(201).json(newTask);
}));

app.put('/tasks/:id', asyncHandler(async (req, res) => {
    const updatedTask = await updateTask({ id: req.params.id, ...req.body });
    res.json(updatedTask);
}));

app.delete('/tasks/:id', asyncHandler(async (req, res) => {
    await deleteTask(req.params.id);
    res.sendStatus(204);
}));

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(err.status || 500).json({ error: err.message });
});

// Export Lambda handler
export const handler = serverless(app);
