// Express application configurations
import express from "express"
import cors from 'cors'
import { errorHandler } from "./middleware/errorHandler.js"

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'https://localhost:5173' }));
app.use(express.json());
app.use(errorHandler);

export default app;