import cron from 'node-cron';
import { SnapshotBuilder } from '../processors/snapshotBuilder';
import { AlertChecker } from '../processors/alertChecker';
import { MetricsComputer } from '../processors/metricsComputer';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = process.env.TIMEZONE || 'Europe/Lisbon';

// Schedule: Daily at 23:55 Europe/Lisbon
const DAILY_SCHEDULE = '55 23 * * *';
// Schedule: Every 15 minutes
const ALERT_SCHEDULE = '*/15 * * * *';
// Schedule: Weekly on Sunday at 23:59
const WEEKLY_SCHEDULE = '59 23 * * 0';

export const Scheduler = {
    start() {
        console.log(`Scheduler started. Timezone: ${TIMEZONE}`);

        // Daily Snapshots
        cron.schedule(DAILY_SCHEDULE, async () => {
            console.log(`[${dayjs().format()}] Starting Daily Snapshot Job...`);
            try {
                await Promise.all([
                    SnapshotBuilder.buildLeadSnapshot(),
                    SnapshotBuilder.buildDealSnapshot(),
                ]);
                console.log(`[${dayjs().format()}] Daily Snapshot Job Completed.`);
            } catch (error) {
                console.error(`[${dayjs().format()}] Daily Snapshot Job Failed:`, error);
            }
        }, { timezone: TIMEZONE });

        // Alerts
        cron.schedule(ALERT_SCHEDULE, async () => {
            console.log(`[${dayjs().format()}] Starting Alert Check...`);
            try {
                await AlertChecker.runChecks();
            } catch (error) {
                console.error(`[${dayjs().format()}] Alert Check Failed:`, error);
            }
        }, { timezone: TIMEZONE });

        // Weekly Metrics
        cron.schedule(WEEKLY_SCHEDULE, async () => {
            console.log(`[${dayjs().format()}] Starting Weekly Metrics Computation...`);
            try {
                await MetricsComputer.computeDailyMetrics();
                console.log(`[${dayjs().format()}] Weekly Metrics Completed.`);
            } catch (error) {
                console.error(`[${dayjs().format()}] Weekly Metrics Failed:`, error);
            }
        }, { timezone: TIMEZONE });

        console.log('Jobs scheduled: Daily Snapshot, Alerts (15m), Weekly Metrics.');
    }
};
