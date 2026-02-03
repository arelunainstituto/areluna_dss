import { fetchOwnerNames, extractOwnerId } from '../utils/ownerLookup';
import dotenv from 'dotenv';
dotenv.config();

async function testOwnerLookup() {
    console.log('🔍 Testing Owner Lookup...\n');

    // Test with some sample IDs from the previous output
    const testIds = [
        '829550000011590001',
        '829550000000589195',
        '829550000002140001',
        '829550000000589019'
    ];

    console.log('📋 Fetching names for IDs:', testIds);

    try {
        const names = await fetchOwnerNames(testIds);

        console.log('\n✅ Results:');
        names.forEach((name, id) => {
            console.log(`  ${id.slice(-6)}: ${name}`);
        });
    } catch (error: any) {
        console.error('❌ Error:', error.message);
    }
}

testOwnerLookup();
