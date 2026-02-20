import { VercelRequest, VercelResponse } from '@vercel/node';
import { AlertChecker } from '../src/processors/alertChecker';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).end('Unauthorized');
    }

    try {
        await AlertChecker.runChecks();
        res.status(200).json({ success: true, message: 'Alert checks completed' });
    } catch (error) {
        console.error('Cron job error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
