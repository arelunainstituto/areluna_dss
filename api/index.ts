import express from 'express';
import cors from 'cors';
import { ENV } from '../src/config/env';

import dashboardRoutes from '../src/api/routes/dashboard';
import alertsRoutes from '../src/api/routes/alerts';
import metricsRoutes from '../src/api/routes/metrics';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/metrics', metricsRoutes);

// Export the express app as a module for Vercel serverless function
module.exports = app;
