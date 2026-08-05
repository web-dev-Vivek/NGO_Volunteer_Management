// Express application configurations
import express from "express"
import cors from 'cors'
import path from 'path'
import { errorHandler } from "./middleware/errorHandler.js"
import campaignRoutes from './modules/campaigns/campaigns.routes.js'
import certificateRoutes from './modules/certificates/certificates.routes.js'

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'https://localhost:5173' }));
app.use(express.json());

// Serve the uploads folder statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Mount routes
app.use('/api/campaigns', campaignRoutes);
app.use('/api/certificates', certificateRoutes);

app.use(errorHandler);

export default app;