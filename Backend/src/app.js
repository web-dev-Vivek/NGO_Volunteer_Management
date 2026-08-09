// Express application configurations
import express from "express"
import cors from 'cors'
import { errorHandler } from "./middleware/errorHandler.js"
import authRoutes from './modules/auth/auth.routes.js';
import taskRoutes from './modules/tasks/tasks.routes.js';
import notificationRoutes from "./modules/notification/notification.routes.js";
import certificateRoutes from "./modules/certificates/certificates.routes.js";



const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/certificates", certificateRoutes);

app.use(errorHandler);

export default app;
