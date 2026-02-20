import { LeadExtractor } from './extractors/leadExtractor';
import { getOwnerName } from './config/ownerMapping';

async function investigateConversion() {
    console.log('=== Investigação de Taxa de Conversão ===\n');

    try {
        // Buscar leads com videochamada
        const leadsWithVideo = await LeadExtractor.getLeadsWithVideoCall();
        console.log(`Total de leads com videochamada: ${leadsWithVideo.length}\n`);

        // Analisar cada lead em detalhes
        console.log('=== Análise Detalhada dos Leads ===\n');

        for (const lead of leadsWithVideo) {
            const ownerName = await getOwnerName(lead.Owner);
            console.log(`Lead ID: ${lead.id}`);
            console.log(`  Status: ${lead.Lead_Status}`);
            console.log(`  Owner: ${ownerName}`);
            console.log(`  Converted__s: ${lead.Converted__s}`);
            console.log(`  Converted_Date_Time: ${lead.Converted_Date_Time}`);
            console.log(`  Created_Time: ${lead.Created_Time}`);
            console.log('---');
        }

        // Verificar diferentes critérios de conversão
        console.log('\n=== Testando Diferentes Critérios ===\n');

        const convertedByDateTime = leadsWithVideo.filter(l =>
            l.Converted_Date_Time != null && l.Converted_Date_Time !== ''
        );
        console.log(`Convertidos por Converted_Date_Time: ${convertedByDateTime.length}`);

        const convertedByFlag = leadsWithVideo.filter(l =>
            l.Converted__s === true || l.Converted__s === 1 || l.Converted__s === '1'
        );
        console.log(`Convertidos por Converted__s: ${convertedByFlag.length}`);

        const convertedStatus = leadsWithVideo.filter(l =>
            l.Lead_Status && l.Lead_Status.toLowerCase().includes('convertido')
        );
        console.log(`Convertidos por status (contém 'convertido'): ${convertedStatus.length}`);

    } catch (error: any) {
        console.error('Erro:', error.message);
        if (error.stack) {
            console.error(error.stack);
        }
    }
}

investigateConversion();
