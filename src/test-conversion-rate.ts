import { LeadExtractor } from './extractors/leadExtractor';
import { DashboardService } from './services/dashboardService';
import { getOwnerName } from './config/ownerMapping';

async function testConversionRate() {
    console.log('=== Teste de Taxa de Conversão ===\n');

    try {
        // 1. Buscar leads com videochamada
        const leadsWithVideo = await LeadExtractor.getLeadsWithVideoCall();
        console.log(`✓ Total de leads com videochamada: ${leadsWithVideo.length}`);

        // 2. Filtrar leads convertidos
        const convertedLeads = leadsWithVideo.filter(lead =>
            lead.Converted_Date_Time != null && lead.Converted_Date_Time !== ''
        );
        console.log(`✓ Leads convertidos após videochamada: ${convertedLeads.length}`);

        // 3. Calcular taxa manual
        const manualRate = leadsWithVideo.length > 0
            ? (convertedLeads.length / leadsWithVideo.length) * 100
            : 0;
        console.log(`✓ Taxa de conversão (manual): ${manualRate.toFixed(2)}%\n`);

        // 4. Buscar do dashboard
        console.log('Buscando métricas do dashboard...');
        const metrics = await DashboardService.getCommercialMetrics();
        console.log(`✓ Taxa de conversão (dashboard): ${metrics.primary.globalConversion.toFixed(2)}%`);

        // 5. Comparar
        console.log('\n=== Validação ===');
        if (Math.abs(manualRate - metrics.primary.globalConversion) < 0.01) {
            console.log('✅ Taxa de conversão calculada corretamente!');
        } else {
            console.log('❌ Erro no cálculo da taxa de conversão!');
            console.log(`   Esperado: ${manualRate.toFixed(2)}%`);
            console.log(`   Obtido: ${metrics.primary.globalConversion.toFixed(2)}%`);
        }

        // 6. Mostrar por vendedor
        console.log('\n=== Taxa de Conversão por Vendedor ===');
        const sortedOwners = Object.entries(metrics.primary.conversionByOwner)
            .sort(([, a], [, b]) => b - a);

        for (const [owner, rate] of sortedOwners) {
            console.log(`${owner}: ${rate.toFixed(2)}%`);
        }

        // 7. Mostrar contexto adicional
        console.log('\n=== Contexto Adicional ===');
        console.log(`Deals ganhos no mês: ${metrics.primary.dealsWon}`);
        console.log(`Deals perdidos no mês: ${metrics.primary.dealsLost}`);
        console.log(`Deals em aberto: ${metrics.primary.dealsOpen}`);
        console.log(`Leads com videochamada: ${metrics.primary.leadsWithVideo}`);
        console.log(`Leads convertidos: ${metrics.primary.leadsConverted}`);

        // 8. Mostrar alguns exemplos de leads
        if (leadsWithVideo.length > 0) {
            console.log('\n=== Exemplos de Leads com Videochamada ===');
            for (let i = 0; i < Math.min(5, leadsWithVideo.length); i++) {
                const lead = leadsWithVideo[i];
                const ownerName = await getOwnerName(lead.Owner);
                console.log(`${i + 1}. ID: ${lead.id} | Status: ${lead.Lead_Status} | Owner: ${ownerName} | Convertido: ${lead.Converted__s ? 'Sim' : 'Não'}`);
            }
        }

    } catch (error: any) {
        console.error('❌ Erro ao testar taxa de conversão:', error.message);
        if (error.stack) {
            console.error(error.stack);
        }
    }
}

testConversionRate();
