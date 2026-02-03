import { zohoClient } from '../config/zoho';
import dotenv from 'dotenv';
dotenv.config();

async function testZohoData() {
    console.log('🔍 Testing if Zoho CRM has any Leads data...\n');

    try {
        // Simple query to get ANY leads (WHERE clause is required by Zoho Function)
        const query = 'SELECT id, First_Name, Last_Name, Created_Time FROM Leads WHERE id is not null LIMIT 10';
        console.log('Query:', query);

        const response = await zohoClient.coqlRequest(query);
        console.log('\n📦 Raw Response:', JSON.stringify(response, null, 2));

        // Try to extract data
        const data = response?.data || response?.details?.output?.data || response;
        console.log('\n📊 Data extracted:', data);

        if (Array.isArray(data) && data.length > 0) {
            console.log(`\n✅ SUCCESS: Found ${data.length} leads in Zoho CRM`);
            console.log('Sample lead:', JSON.stringify(data[0], null, 2));
        } else {
            console.log('\n⚠️  No leads found in Zoho CRM.');
            console.log('This could mean:');
            console.log('  1. The CRM is empty');
            console.log('  2. The API response format is different than expected');
            console.log('  3. Authentication issue (though it would error earlier)');
        }
    } catch (error: any) {
        console.error('\n❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testZohoData();
