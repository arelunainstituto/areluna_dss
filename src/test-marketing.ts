import axios from 'axios';

async function testMarketing() {
    try {
        console.log('Testing Marketing Dashboard...\n');
        const marketing = await axios.get('http://localhost:3000/api/dashboard/marketing');
        console.log('Marketing Metrics:');
        console.log(JSON.stringify(marketing.data, null, 2));

        console.log('\n\nLead Sources:');
        console.log(JSON.stringify(marketing.data.primary.bySource, null, 2));

    } catch (error: any) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

testMarketing();
