import axios from 'axios';

async function testDashboards() {
    try {
        console.log('Testing Executive Dashboard...\n');
        const executive = await axios.get('http://localhost:3000/api/dashboard/executive');
        console.log('Executive Metrics:');
        console.log(JSON.stringify(executive.data, null, 2));

        console.log('\n\nTesting Commercial Dashboard...\n');
        const commercial = await axios.get('http://localhost:3000/api/dashboard/commercial');
        console.log('Commercial Metrics:');
        console.log(JSON.stringify(commercial.data, null, 2));

    } catch (error: any) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

testDashboards();
