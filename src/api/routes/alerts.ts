import { Router } from 'express';
import { supabase } from '../../config/supabase';

const router = Router();

// GET /api/alerts/active
router.get('/active', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('alert_log')
            .select('*')
            .eq('resolved', false)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err: any) {
        console.error('Error fetching alerts:', err);
        res.status(500).json({ error: 'Failed to fetch active alerts' });
    }
});

export default router;
