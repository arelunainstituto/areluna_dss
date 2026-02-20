import { supabase } from '../config/supabase';
import { MathUtils } from '../utils/math';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const MetricsComputer = {

    async computeDailyMetrics() {
        console.log('Computing secondary metrics...');
        // Fetch last 30 days of lead snapshots
        const todayStr = dayjs().tz(process.env.TIMEZONE || 'Europe/Lisbon').format('YYYY-MM-DD');
        const thirtyDaysAgo = dayjs().tz(process.env.TIMEZONE || 'Europe/Lisbon').subtract(30, 'day').format('YYYY-MM-DD');
        const { data: leadSnaps } = await supabase
            .from('daily_lead_snapshot')
            .select('*')
            .gte('snapshot_date', thirtyDaysAgo)
            .order('snapshot_date', { ascending: true });

        if (leadSnaps && leadSnaps.length > 0) {
            const leads = leadSnaps.map(s => s.total_leads);
            const dates = leadSnaps.map(s => s.snapshot_date);

            // S1: Avg Daily Leads
            const avgLeads = MathUtils.median(leads); // Using median as simpler proxy or calculating avg manually
            // S4: Std Dev
            const stdDev = MathUtils.standardDeviation(leads);
            // S11: Trend (Slope)
            const xyData = leads.map((y, i) => ({ x: i, y }));
            const trend = MathUtils.linearRegression(xyData);

            await this.saveMetric('avg_daily_leads_30d', avgLeads);
            await this.saveMetric('stddev_daily_leads_30d', stdDev);
            await this.saveMetric('leads_trend_slope_30d', trend.slope);
        }
    },

    async saveMetric(name: string, value: number, metadata = {}) {
        const todayStr = dayjs().tz(process.env.TIMEZONE || 'Europe/Lisbon').format('YYYY-MM-DD');
        const { error } = await supabase
            .from('computed_metrics')
            .upsert({
                metric_name: name,
                metric_value: value,
                metric_metadata: metadata,
                period_start: todayStr,
                period_end: todayStr
            }, { onConflict: 'metric_name,period_start,period_end' });

        if (error) console.error(`Error saving metric ${name}:`, error);
    }
};
