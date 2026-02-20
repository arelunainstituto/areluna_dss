import { LeadExtractor } from '../extractors/leadExtractor';
import { DealExtractor } from '../extractors/dealExtractor';
import { supabase } from '../config/supabase';
import { countBy, sum, average } from '../utils/aggregator';
import { normalizeInterest } from '../utils/normalizeInterest';
import { getOwnerName } from '../config/ownerMapping';
import dayjs from 'dayjs';

export const DashboardService = {
    /**
     * Executive Dashboard Data
     * E1-E6 (Realtime) + E7-E9 (History)
     */
    async getExecutiveMetrics() {
        // Realtime (Primary)
        const wonDealsCurrentMonth = await DealExtractor.getWonDealsCurrentMonth();
        const openPipeline = await DealExtractor.getOpenPipeline();
        const deptDeals = await DealExtractor.getDealsWithOutstandingBalance();

        // E1: Receita Total Fechada (Month? Or All Time? Prompt says "Won", usually implies current period for dashboards or Total YTD. Let's assume Month for now based on Q-D2 usage)
        const E1_Revenue = sum(wonDealsCurrentMonth, 'Amount');
        // E2: Valor Entrada Real
        const E2_CashIn = sum(wonDealsCurrentMonth, 'Valor_de_Entrada');
        // E3: Ticket Médio
        const E3_AvgTicket = average(wonDealsCurrentMonth, 'Amount');
        // E4: Pipeline Forecast (Weighted)
        const E4_Forecast = openPipeline.reduce((acc, d) => acc + (parseFloat(d.Amount || 0) * (parseInt(d.Probability || 0) / 100)), 0);
        // E5: Receita por Unidade
        const E5_RevenueByUnit = wonDealsCurrentMonth.reduce((acc: any, d) => {
            const unit = d.Unidade_Atendimento || 'Unknown';
            acc[unit] = (acc[unit] || 0) + parseFloat(d.Amount || 0);
            return acc;
        }, {});
        // E6: Saldo em Aberto
        const E6_Debt = sum(deptDeals, 'Saldo_Restante');

        // Historical (Secondary from Supabase)
        // E7: Receita por Mês (Last 6 months)
        const { data: historyData } = await supabase
            .from('daily_deal_snapshot')
            .select('snapshot_date, won_amount')
            .gte('snapshot_date', dayjs().subtract(6, 'month').format('YYYY-MM-DD'))
            .order('snapshot_date', { ascending: true });

        // E7, E8, E9 would be derived from historyData processing

        return {
            primary: {
                totalRevenue: E1_Revenue,
                cashIn: E2_CashIn,
                avgTicket: E3_AvgTicket,
                forecast: E4_Forecast,
                revenueByUnit: E5_RevenueByUnit,
                totalDebt: E6_Debt
            },
            secondary: {
                history: historyData || []
            }
        };
    },

    /**
     * Commercial Dashboard Data
     * C1-C7, C10 (Realtime) + C8, C9, C11 (History)
     */
    async getCommercialMetrics() {
        // Buscar leads com videochamada para taxa de conversão
        const leadsWithVideo = await LeadExtractor.getLeadsWithVideoCall();

        // Filtrar leads convertidos (aqueles que têm Converted_Date_Time preenchido)
        const convertedLeadsWithVideo = leadsWithVideo.filter(lead =>
            lead.Converted_Date_Time != null && lead.Converted_Date_Time !== ''
        );

        // C1: Taxa de Conversão Global (Leads convertidos / Leads com videochamada)
        const totalWithVideo = leadsWithVideo.length;
        const convertedWithVideo = convertedLeadsWithVideo.length;
        const C1_ConversionRate = totalWithVideo > 0
            ? (convertedWithVideo / totalWithVideo) * 100
            : 0;

        // C2: Taxa de Conversão por Vendedor
        const videoByOwner: Record<string, number> = {};
        const convertedByOwner: Record<string, number> = {};

        for (const lead of leadsWithVideo) {
            const ownerName = await getOwnerName(lead.Owner);
            videoByOwner[ownerName] = (videoByOwner[ownerName] || 0) + 1;
        }

        for (const lead of convertedLeadsWithVideo) {
            const ownerName = await getOwnerName(lead.Owner);
            convertedByOwner[ownerName] = (convertedByOwner[ownerName] || 0) + 1;
        }

        const C2_ConversionByOwner: Record<string, number> = {};
        Object.keys(videoByOwner).forEach(owner => {
            const total = videoByOwner[owner];
            const converted = convertedByOwner[owner] || 0;
            C2_ConversionByOwner[owner] = total > 0 ? (converted / total) * 100 : 0;
        });

        // Manter métricas de deals para outras visualizações
        const wonDeals = await DealExtractor.getWonDealsCurrentMonth();
        const lostDeals = await DealExtractor.getLostDealsCurrentMonth();
        const openDeals = await DealExtractor.getOpenPipeline();
        const C4_Funnel = countBy(openDeals, 'Stage');

        return {
            primary: {
                globalConversion: C1_ConversionRate,
                conversionByOwner: C2_ConversionByOwner,
                funnel: C4_Funnel,
                dealsWon: wonDeals.length,
                dealsLost: lostDeals.length,
                dealsOpen: openDeals.length,
                // Novas métricas para contexto
                leadsWithVideo: totalWithVideo,
                leadsConverted: convertedWithVideo
            }
        }
    },

    /**
     * Marketing Dashboard Data
     * M1-M8 (Realtime) + History
     */
    async getMarketingMetrics() {
        const leadsToday = await LeadExtractor.getLeadsCreatedToday();
        const leadsMonth = await LeadExtractor.getLeadsCurrentMonth(); // Q-L3

        // M1: Leads Counts
        const M1_LeadsToday = leadsToday.length;
        const M1_LeadsMonth = leadsMonth.length;

        // M2: Leads by Channel - Normalize before counting
        const { normalizeLeadSource } = await import('../utils/normalizeLeadSource');
        const leadsWithNormalizedSource = leadsMonth.map(lead => ({
            ...lead,
            Lead_Source_Normalized: normalizeLeadSource(lead.Lead_Source)
        }));
        const M2_BySource = countBy(leadsWithNormalizedSource, 'Lead_Source_Normalized');

        // M3: Leads by Interest
        const M3_ByInterest = countBy(leadsMonth, 'Interesses', normalizeInterest);

        return {
            primary: {
                leadsToday: M1_LeadsToday,
                leadsMonth: M1_LeadsMonth,
                bySource: M2_BySource,
                byInterest: M3_ByInterest
            }
        }
    },

    /**
     * Operational Dashboard Data
     * O1-O4 (Realtime)
     */
    async getOperationalMetrics() {
        const wonDeals = await DealExtractor.getWonDealsCurrentMonth();
        const leadsMonth = await LeadExtractor.getLeadsByOwnerCurrentMonth();

        // Use owner name extraction with API lookup fallback
        const { getOwnerName } = await import('../config/ownerMapping');

        // O1: Sales by Owner (Manager)
        const O1_SalesByOwner: Record<string, number> = {};
        for (const d of wonDeals) {
            const ownerName = await getOwnerName(d.Owner);
            O1_SalesByOwner[ownerName] = (O1_SalesByOwner[ownerName] || 0) + parseFloat(d.Amount || 0);
        }

        // O2: Qtd Deals by Owner (Manager)
        const O2_CountByOwner: Record<string, number> = {};
        for (const d of wonDeals) {
            const ownerName = await getOwnerName(d.Owner);
            O2_CountByOwner[ownerName] = (O2_CountByOwner[ownerName] || 0) + 1;
        }

        // O3: Qtd Leads by Owner (Manager)
        const O3_LeadsByOwner: Record<string, number> = {};
        for (const lead of leadsMonth) {
            const ownerName = await getOwnerName(lead.Owner);
            O3_LeadsByOwner[ownerName] = (O3_LeadsByOwner[ownerName] || 0) + 1;
        }

        return {
            primary: {
                salesByOwner: O1_SalesByOwner,
                countByOwner: O2_CountByOwner,
                leadsByOwner: O3_LeadsByOwner,
            }
        }
    }
};
