import { DashboardService } from './services/dashboardService';

async function testOperationalMetrics() {
    console.log('Testing Operational Metrics...\n');

    try {
        const metrics = await DashboardService.getOperationalMetrics();

        console.log('✅ Successfully fetched operational metrics\n');
        console.log('Sales by Owner (O1):');
        console.log(JSON.stringify(metrics.primary.salesByOwner, null, 2));

        console.log('\nDeals Count by Owner (O2):');
        console.log(JSON.stringify(metrics.primary.countByOwner, null, 2));

        console.log('\nLeads Count by Owner (O3):');
        console.log(JSON.stringify(metrics.primary.leadsByOwner, null, 2));

    } catch (error) {
        console.error('❌ Error fetching operational metrics:', error);
        process.exit(1);
    }
}

testOperationalMetrics();
