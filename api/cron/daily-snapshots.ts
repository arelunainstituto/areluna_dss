import { VercelRequest, VercelResponse } from '@vercel/node';
import { SnapshotBuilder } from '../src/processors/snapshotBuilder';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).end('Unauthorized');
    }

    try {
        await Promise.all([
            SnapshotBuilder.buildLeadSnapshot(),
            SnapshotBuilder.buildDealSnapshot(),
        ]);
        res.status(200).json({ success: true, message: 'Daily snapshots completed' });
    } catch (error) {
        console.error('Cron job error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
