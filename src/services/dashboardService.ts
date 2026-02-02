import { LeadExtractor } from '../extractors/leadExtractor';
import { DealExtractor } from '../extractors/dealExtractor';
import { supabase } from '../config/supabase';
import { countBy, sum, average } from '../utils/aggregator';
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
        // Realtime
        const dealsMonth = await DealExtractor.getDealsCreatedCurrentMonth(); // For conversion calc base? Or all deals closed this month?
        const wonDeals = await DealExtractor.getWonDealsCurrentMonth();
        const lostDeals = await DealExtractor.getLostDealsCurrentMonth();
        const openDeals = await DealExtractor.getOpenPipeline();

        // C1: Conversion Rate Global (Won / (Won + Lost) or Won / Created? Usually Won / Closed)
        const closedCount = wonDeals.length + lostDeals.length;
        const C1_ConversionRate = closedCount > 0 ? (wonDeals.length / closedCount) * 100 : 0;

        // C2: Conversion per Owner
        // Need to group won and lost by owner
        const wonByOwner = countBy(wonDeals, 'Owner');
        const lostByOwner = countBy(lostDeals, 'Owner');
        // Merge keys
        const owners = new Set([...Object.keys(wonByOwner), ...Object.keys(lostByOwner)]);
        const C2_ConversionByOwner: Record<string, number> = {};
        owners.forEach(o => {
            const w = wonByOwner[o] || 0;
            const l = lostByOwner[o] || 0;
            const total = w + l;
            C2_ConversionByOwner[o] = total > 0 ? (w / total) * 100 : 0;
        });

        // C4: Funnel (Deals by Stage)
        const C4_Funnel = countBy(openDeals, 'Stage');

        return {
            primary: {
                globalConversion: C1_ConversionRate,
                conversionByOwner: C2_ConversionByOwner,
                funnel: C4_Funnel,
                dealsWon: wonDeals.length,
                dealsLost: lostDeals.length,
                dealsOpen: openDeals.length
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

        // M2: Leads by Channel
        const M2_BySource = countBy(leadsMonth, 'Lead_Source');

        // M3: Leads by Interest
        const M3_ByInterest = countBy(leadsMonth, 'Interesses');

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

        // O1: Sales by Doctor
        const O1_SalesByDoctor = wonDeals.reduce((acc: any, d) => {
            const doc = d.Doutor_Respons_vel || 'Unknown';
            // Normalize if object
            const docName = typeof doc === 'object' && doc.name ? doc.name : String(doc);
            acc[docName] = (acc[docName] || 0) + parseFloat(d.Amount || 0);
            return acc;
        }, {});

        // O2: Qtd Deals by Doctor
        const O2_CountByDoctor = countBy(wonDeals, 'Doutor_Respons_vel');

        return {
            primary: {
                salesByDoctor: O1_SalesByDoctor,
                countByDoctor: O2_CountByDoctor,
            }
        }
    }
};
