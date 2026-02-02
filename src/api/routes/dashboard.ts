import { Router } from 'express';
import { DashboardService } from '../../services/dashboardService';

const router = Router();

// /api/dashboard/executive
router.get('/executive', async (req, res) => {
    try {
        const data = await DashboardService.getExecutiveMetrics();
        res.json(data);
    } catch (error) {
        console.error('Executive Dashboard Error:', error);
        res.status(500).json({ error: 'Failed to fetch executive metrics' });
    }
});

// /api/dashboard/commercial
router.get('/commercial', async (req, res) => {
    try {
        const data = await DashboardService.getCommercialMetrics();
        res.json(data);
    } catch (error) {
        console.error('Commercial Dashboard Error:', error);
        res.status(500).json({ error: 'Failed to fetch commercial metrics' });
    }
});

// /api/dashboard/marketing
router.get('/marketing', async (req, res) => {
    try {
        const data = await DashboardService.getMarketingMetrics();
        res.json(data);
    } catch (error) {
        console.error('Marketing Dashboard Error:', error);
        res.status(500).json({ error: 'Failed to fetch marketing metrics' });
    }
});

// /api/dashboard/operational
router.get('/operational', async (req, res) => {
    try {
        const data = await DashboardService.getOperationalMetrics();
        res.json(data);
    } catch (error) {
        console.error('Operational Dashboard Error:', error);
        res.status(500).json({ error: 'Failed to fetch operational metrics' });
    }
});

export default router;
