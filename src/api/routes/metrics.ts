import { Router } from 'express';
import { supabase } from '../../config/supabase';

const router = Router();

// GET /api/metrics/stats?metric=total_leads
router.get('/stats', async (req, res) => {
    // Return basic stats like avg/stddev from computed_metrics
    try {
        const { data, error } = await supabase
            .from('computed_metrics')
            .select('*')
            .order('computed_at', { ascending: false })
            .limit(20);

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch metrics stats' });
    }
});

// GET /api/metrics/:metricName
router.get('/:metricName', async (req, res) => {
    const { metricName } = req.params;
    try {
        const { data, error } = await supabase
            .from('computed_metrics')
            .select('*')
            .eq('metric_name', metricName)
            .order('period_start', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: `Failed to fetch metric ${metricName}` });
    }
});

export default router;
