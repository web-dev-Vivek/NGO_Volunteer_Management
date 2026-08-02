// Express application configurations
import express from "express"
import cors from 'cors'
import { errorHandler } from "./middleware/errorHandler.js"
import authRoutes from './modules/auth/auth.routes.js';
import taskRoutes from './modules/tasks/tasks.routes.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'https://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(errorHandler);

export default app;