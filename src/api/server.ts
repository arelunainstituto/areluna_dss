import express from 'express';
import cors from 'cors';
import { ENV } from '../config/env';
import { Scheduler } from '../scheduler/jobs';

import dashboardRoutes from './routes/dashboard';
import alertsRoutes from './routes/alerts';
import metricsRoutes from './routes/metrics';
import path from 'path';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend')));

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date(), env: ENV.APP.NODE_ENV });
});

// Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/metrics', metricsRoutes);

// Fallback for SPA (if we had client-side routing, but we have simple index.html)
// Fallback for SPA (if we had client-side routing, but we have simple index.html)
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

export const startServer = () => {
    // Start Scheduler
    Scheduler.start();

    // Start Express
    app.listen(ENV.APP.PORT, () => {
        console.log(`DSS Backend running on port ${ENV.APP.PORT} in ${ENV.APP.NODE_ENV} mode.`);
    });
};

if (require.main === module) {
    startServer();
}
