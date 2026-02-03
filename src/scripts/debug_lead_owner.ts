import { LeadExtractor } from '../extractors/leadExtractor';
import dotenv from 'dotenv';
dotenv.config();

async function debugLeadOwner() {
    console.log('🔍 Debugging Lead Owner field structure...\n');

    try {
        const leads = await LeadExtractor.getLeadsCurrentMonth();

        if (leads.length > 0) {
            console.log('Total Leads:', leads.length);
            console.log('\n📦 Sample Lead (first one):');
            console.log(JSON.stringify(leads[0], null, 2));

            console.log('\n🔑 Owner field specifically:');
            console.log('Type:', typeof leads[0].Owner);
            console.log('Value:', leads[0].Owner);
            console.log('JSON:', JSON.stringify(leads[0].Owner, null, 2));

            // Check all unique owner structures
            console.log('\n📊 All unique Owner values:');
            const owners = new Map();
            leads.forEach(l => {
                const ownerStr = JSON.stringify(l.Owner);
                if (!owners.has(ownerStr)) {
                    owners.set(ownerStr, l.Owner);
                }
            });

            console.log(`Found ${owners.size} unique owners in Leads:\n`);
            Array.from(owners.values()).slice(0, 10).forEach((o, i) => {
                console.log(`${i + 1}:`, JSON.stringify(o, null, 2));
            });
        } else {
            console.log('No leads found in current month');
        }
    } catch (error: any) {
        console.error('❌ Error:', error.message);
    }
}

debugLeadOwner();
