import { LeadExtractor } from './extractors/leadExtractor';
import { DealExtractor } from './extractors/dealExtractor';
import { getOwnerName } from './config/ownerMapping';

async function investigateDealsVsLeads() {
    console.log('=== Investigação: Deals vs Leads ===\n');

    try {
        // 1. Buscar deals ganhos deste mês
        const wonDeals = await DealExtractor.getWonDealsCurrentMonth();
        console.log(`Deals ganhos este mês: ${wonDeals.length}\n`);

        // 2. Buscar TODOS os leads criados este mês (não apenas com vídeo)
        const allLeads = await LeadExtractor.getLeadsCurrentMonth();
        console.log(`Total de leads criados este mês: ${allLeads.length}`);

        // 3. Quantos desses leads foram convertidos?
        const convertedLeads = allLeads.filter(l =>
            l.Converted_Date_Time != null && l.Converted_Date_Time !== ''
        );
        console.log(`Leads convertidos este mês: ${convertedLeads.length}\n`);

        if (convertedLeads.length > 0) {
            console.log('=== Leads Convertidos ===');
            for (const lead of convertedLeads.slice(0, 5)) {
                const ownerName = await getOwnerName(lead.Owner);
                console.log(`ID: ${lead.id} | Status: ${lead.Lead_Status} | Owner: ${ownerName} | Converted: ${lead.Converted_Date_Time}`);
            }
        }

        // 4. Analisar alguns deals ganhos
        console.log('\n=== Exemplos de Deals Ganhos ===');
        for (const deal of wonDeals.slice(0, 5)) {
            const ownerName = await getOwnerName(deal.Owner);
            console.log(`Deal: ${deal.Deal_Name}`);
            console.log(`  Stage: ${deal.Stage}`);
            console.log(`  Owner: ${ownerName}`);
            console.log(`  Closing Date: ${deal.Closing_Date}`);
            console.log(`  Created Time: ${deal.Created_Time}`);
            console.log('---');
        }

        // 5. Verificar se há campo Lead_Source ou Lead_Id nos deals
        console.log('\n=== Verificando Relacionamento Lead->Deal ===');
        const firstDeal = wonDeals[0];
        console.log('Campos do primeiro deal:');
        console.log(JSON.stringify(firstDeal, null, 2));

    } catch (error: any) {
        console.error('Erro:', error.message);
        if (error.stack) {
            console.error(error.stack);
        }
    }
}

investigateDealsVsLeads();
