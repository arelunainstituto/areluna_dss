import { VercelRequest, VercelResponse } from '@vercel/node';
import { MetricsComputer } from '../src/processors/metricsComputer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).end('Unauthorized');
    }

    try {
        await MetricsComputer.computeDailyMetrics();
        res.status(200).json({ success: true, message: 'Weekly metrics completed' });
    } catch (error) {
        console.error('Cron job error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
