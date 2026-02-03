import { SnapshotBuilder } from '../processors/snapshotBuilder';
import { AlertChecker } from '../processors/alertChecker';
import { MetricsComputer } from '../processors/metricsComputer';
import { supabase } from '../config/supabase';
import dayjs from 'dayjs';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
    console.log('🚀 Starting Manual Trigger...');
    const start = Date.now();

    try {
        // 1. Build Snapshots
        console.log('\n📸 Building Daily Snapshots...');
        await Promise.all([
            SnapshotBuilder.buildLeadSnapshot(),
            SnapshotBuilder.buildDealSnapshot(),
        ]);
        console.log('✅ Snapshots created.');

        // 2. Compute Metrics
        console.log('\n🧮 Computing Secondary Metrics...');
        await MetricsComputer.computeDailyMetrics();
        console.log('✅ Metrics computed.');

        // 3. Check Alerts
        console.log('\n🚨 Running Alert Checks...');
        await AlertChecker.runChecks();
        console.log('✅ Alerts checked.');

        console.log(`\n🎉 Extraction Cycle Complete in ${((Date.now() - start) / 1000).toFixed(2)}s`);
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error executing manual trigger:', error);
        process.exit(1);
    }
};

run();
