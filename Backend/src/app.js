// Express application configurations
import express from "express"
import cors from 'cors'
import { errorHandler } from "./middlewares/errorHandler.js"
import authRoutes from './modules/auth/auth.routes.js';

app.use('/api/auth', authRoutes);

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'https://localhost:5173' }));
app.use(express.json());
app.use(errorHandler);

export default app;