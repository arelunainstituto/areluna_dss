import { LeadExtractor } from '../extractors/leadExtractor';
import { DealExtractor } from '../extractors/dealExtractor';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import dotenv from 'dotenv';

dayjs.extend(utc);
dayjs.extend(timezone);
dotenv.config();

interface TestResult {
    name: string;
    success: boolean;
    recordCount?: number;
    error?: string;
    duration?: number;
}

const results: TestResult[] = [];

async function runTest(name: string, fn: () => Promise<any[]>): Promise<void> {
    console.log(`\n🔍 Testing: ${name}...`);
    const start = Date.now();

    try {
        const data = await fn();
        const duration = Date.now() - start;
        const count = data?.length ?? 0;

        results.push({ name, success: true, recordCount: count, duration });
        console.log(`✅ SUCCESS - ${count} records in ${duration}ms`);

        // Show sample data if available
        if (count > 0) {
            console.log(`   Sample:`, JSON.stringify(data[0], null, 2).substring(0, 200) + '...');
        }
    } catch (error: any) {
        const duration = Date.now() - start;
        results.push({
            name,
            success: false,
            error: error.message || String(error),
            duration
        });
        console.log(`❌ FAILED - ${error.message}`);
        if (error.response?.data) {
            console.log(`   Response:`, JSON.stringify(error.response.data, null, 2));
        }
    }
}

async function main() {
    console.log('🚀 Starting Zoho Query Validation...\n');
    console.log('='.repeat(60));

    // Lead Extractor Tests
    console.log('\n📋 LEAD EXTRACTOR TESTS');
    console.log('='.repeat(60));

    await runTest('Q-L1: Leads Created Today', () => LeadExtractor.getLeadsCreatedToday());
    await runTest('Q-L2: Leads Last 7 Days', () => LeadExtractor.getLeadsLast7Days());
    await runTest('Q-L3: Leads Current Month', () => LeadExtractor.getLeadsCurrentMonth());
    await runTest('Q-L4: Leads by Quality (Current Month)', async () => {
        const start = dayjs().tz('Europe/Lisbon').startOf('month');
        const end = dayjs().tz('Europe/Lisbon').endOf('day');
        return LeadExtractor.getLeadsByQuality(start, end);
    });
    await runTest('Q-L5: Untouched Leads (>2h)', () => LeadExtractor.getUntouchedLeads());
    await runTest('Q-L6: Videos Scheduled Today', () => LeadExtractor.getVideosScheduledToday());
    await runTest('Q-L7: Show Rate Data (Current Month)', async () => {
        const start = dayjs().tz('Europe/Lisbon').startOf('month');
        const end = dayjs().tz('Europe/Lisbon').endOf('day');
        return LeadExtractor.getShowRateData(start, end);
    });
    await runTest('Q-L8: Repescagem Converted', () => LeadExtractor.getRepescagemConverted());
    await runTest('Q-L9: Converted Leads Current Month', () => LeadExtractor.getConvertedLeadsCurrentMonth());

    // Deal Extractor Tests
    console.log('\n\n💼 DEAL EXTRACTOR TESTS');
    console.log('='.repeat(60));

    await runTest('Q-D1: Deals Created Current Month', () => DealExtractor.getDealsCreatedCurrentMonth());
    await runTest('Q-D2: Won Deals Current Month', () => DealExtractor.getWonDealsCurrentMonth());
    await runTest('Q-D3: Lost Deals Current Month', () => DealExtractor.getLostDealsCurrentMonth());
    await runTest('Q-D4: Open Pipeline', () => DealExtractor.getOpenPipeline());
    await runTest('Q-D5: Deals With Outstanding Balance', () => DealExtractor.getDealsWithOutstandingBalance());
    await runTest('Q-D6: Weighted Forecast', () => DealExtractor.getWeightedForecast());
    await runTest('Q-D7: SDR Pipeline Deals', () => DealExtractor.getSDRPipelineDeals());
    await runTest('Q-D8: Pending Contracts', () => DealExtractor.getPendingContracts());
    await runTest('Q-D9: Deals Without Down Payment', () => DealExtractor.getDealsWithoutDownPayment());

    // Summary Report
    console.log('\n\n📊 SUMMARY REPORT');
    console.log('='.repeat(60));

    const passed = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const totalRecords = results.reduce((sum, r) => sum + (r.recordCount || 0), 0);

    console.log(`Total Tests: ${results.length}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📦 Total Records Retrieved: ${totalRecords}`);

    if (failed > 0) {
        console.log('\n⚠️  FAILED TESTS:');
        results.filter(r => !r.success).forEach(r => {
            console.log(`   - ${r.name}: ${r.error}`);
        });
    }

    console.log('\n' + '='.repeat(60));
    console.log(failed === 0 ? '🎉 All tests passed!' : `⚠️  ${failed} test(s) failed`);

    process.exit(failed > 0 ? 1 : 0);
}

main();
