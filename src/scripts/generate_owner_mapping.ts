/**
 * Helper script to generate owner mapping
 * 
 * This script will show all unique owner IDs in your won deals
 * and help you create the mapping.
 */

import { DealExtractor } from '../extractors/dealExtractor';
import { extractOwnerId } from '../config/ownerMapping';
import dotenv from 'dotenv';
dotenv.config();

async function generateOwnerMapping() {
    console.log('🔍 Analyzing Owner IDs in Won Deals...\n');

    try {
        const wonDeals = await DealExtractor.getWonDealsCurrentMonth();

        // Get unique owner IDs
        const ownerIds = new Set<string>();
        wonDeals.forEach(d => {
            const id = extractOwnerId(d.Owner);
            if (id !== 'Unknown') {
                ownerIds.add(id);
            }
        });

        console.log(`Found ${ownerIds.size} unique owners:\n`);
        console.log('📋 Copy this to src/config/ownerMapping.ts:\n');
        console.log('export const OWNER_NAMES: Record<string, string> = {');

        Array.from(ownerIds).forEach(id => {
            console.log(`    '${id}': 'NOME_DO_GESTOR_AQUI', // ID: ...${id.slice(-6)}`);
        });

        console.log('};\n');
        console.log('\n📝 Instructions:');
        console.log('1. Open Zoho CRM > Setup > Users & Control > Users');
        console.log('2. Find each user and note their ID (last part of URL when viewing user)');
        console.log('3. Replace "NOME_DO_GESTOR_AQUI" with the actual names');
        console.log('4. Save the file and restart the server\n');

        console.log('💡 Based on your screenshot, the names might be:');
        console.log('   - Dr. Leo');
        console.log('   - Eliane Almeida');
        console.log('   - Felipe Valentin');
        console.log('   - Nicaela Cabral');
        console.log('   - Sofia Falcato');
        console.log('   - Wellen Novato');
        console.log('   - Rebeca Alves');
        console.log('   - Talita Alves');
        console.log('   - Suzana Crista');

    } catch (error: any) {
        console.error('❌ Error:', error.message);
    }
}

generateOwnerMapping();
