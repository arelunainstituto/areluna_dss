import { DealExtractor } from '../extractors/dealExtractor';
import dotenv from 'dotenv';
dotenv.config();

async function debugOwnerField() {
    console.log('🔍 Debugging Owner field structure...\n');

    try {
        const wonDeals = await DealExtractor.getWonDealsCurrentMonth();

        if (wonDeals.length > 0) {
            console.log('Total Won Deals:', wonDeals.length);
            console.log('\n📦 Sample Deal (first one):');
            console.log(JSON.stringify(wonDeals[0], null, 2));

            console.log('\n🔑 Owner field specifically:');
            console.log('Type:', typeof wonDeals[0].Owner);
            console.log('Value:', wonDeals[0].Owner);
            console.log('JSON:', JSON.stringify(wonDeals[0].Owner, null, 2));

            // Check all unique owner structures
            console.log('\n📊 All unique Owner values:');
            const owners = new Set();
            wonDeals.forEach(d => {
                owners.add(JSON.stringify(d.Owner));
            });
            Array.from(owners).slice(0, 5).forEach((o, i) => {
                console.log(`${i + 1}:`, o);
            });
        } else {
            console.log('No won deals found in current month');
        }
    } catch (error: any) {
        console.error('❌ Error:', error.message);
    }
}

debugOwnerField();
