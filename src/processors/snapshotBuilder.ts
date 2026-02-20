import { LeadExtractor } from '../extractors/leadExtractor';
import { DealExtractor } from '../extractors/dealExtractor';
import { countBy, sumByGroup, sum, average } from '../utils/aggregator';
import { normalizeInterest } from '../utils/normalizeInterest';
import { normalizeLeadSource } from '../utils/normalizeLeadSource';
import { supabase } from '../config/supabase';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const SnapshotBuilder = {
    /**
     * Builds and saves the Daily Lead Snapshot.
     */
    async buildLeadSnapshot() {
        console.log('Building Lead Snapshot...');
        const todayLeads = await LeadExtractor.getLeadsCreatedToday();

        // Aggregations - Normalize Lead_Source before counting
        const total_leads = todayLeads.length;
        const leadsWithNormalizedSource = todayLeads.map(lead => ({
            ...lead,
            Lead_Source_Normalized: normalizeLeadSource(lead.Lead_Source)
        }));
        const leads_by_source = countBy(leadsWithNormalizedSource, 'Lead_Source_Normalized');
        const leads_by_interest = countBy(todayLeads, 'Interesses', normalizeInterest);
        const leads_by_unit = countBy(todayLeads, 'Unidade_Atendimento');
        const leads_by_status = countBy(todayLeads, 'Lead_Status');
        const leads_by_country = countBy(todayLeads, 'Country'); // or Em_que_pa_s_voc_mora
        const avg_cost_per_conversion = average(todayLeads, 'Cost_per_Conversion');

        // Converted leads
        const convertedLeads = await LeadExtractor.getConvertedLeadsCurrentMonth();
        const todayStr = dayjs().tz(process.env.TIMEZONE || 'Europe/Lisbon').format('YYYY-MM-DD');
        const convertedToday = convertedLeads.filter(l => {
            if (!l.Converted_Date_Time) return false;
            return dayjs(l.Converted_Date_Time).tz(process.env.TIMEZONE || 'Europe/Lisbon').format('YYYY-MM-DD') === todayStr;
        });
        const converted_count = convertedToday.length;

        const snapshot = {
            snapshot_date: todayStr,
            total_leads,
            leads_by_source,
            leads_by_interest,
            leads_by_unit,
            leads_by_status,
            leads_by_country,
            avg_cost_per_conversion: isNaN(avg_cost_per_conversion) ? 0 : avg_cost_per_conversion,
            converted_count
        };

        // Upsert to Supabase
        const { error } = await supabase
            .from('daily_lead_snapshot')
            .upsert(snapshot, { onConflict: 'snapshot_date' });

        if (error) console.error('Error saving Lead Snapshot:', error);
        else console.log('Lead Snapshot saved successfully.');
    },

    /**
     * Builds and saves the Daily Deal Snapshot.
     */
    async buildDealSnapshot() {
        console.log('Building Deal Snapshot...');

        const today = dayjs().tz(process.env.TIMEZONE || 'Europe/Lisbon').format('YYYY-MM-DD');

        // Won Deals Today
        const wonDealsMonth = await DealExtractor.getWonDealsCurrentMonth();
        const wonDealsToday = wonDealsMonth.filter(d => d.Closing_Date === today);

        // Lost Deals Today
        const lostDealsMonth = await DealExtractor.getLostDealsCurrentMonth();
        const lostDealsToday = lostDealsMonth.filter(d => d.Closing_Date === today);

        // Pipeline (Open)
        const pipelineDeals = await DealExtractor.getOpenPipeline();

        // Inadimplência (Snapshot current state)
        const deptDeals = await DealExtractor.getDealsWithOutstandingBalance();

        const snapshot = {
            snapshot_date: today,
            // Won - Normalize Lead_Source
            won_count: wonDealsToday.length,
            won_amount: sum(wonDealsToday, 'Amount'),
            won_entrada: sum(wonDealsToday, 'Valor_de_Entrada'),
            won_by_interest: countBy(wonDealsToday, 'Interesses', normalizeInterest),
            won_by_unit: countBy(wonDealsToday, 'Unidade_Atendimento'),
            won_by_doctor: countBy(wonDealsToday, 'Doutor_Respons_vel'),
            won_by_owner: countBy(wonDealsToday, 'Owner'),
            won_by_source: countBy(
                wonDealsToday.map(d => ({ ...d, Lead_Source_Normalized: normalizeLeadSource(d.Lead_Source) })),
                'Lead_Source_Normalized'
            ),

            // Lost
            lost_count: lostDealsToday.length,
            lost_amount: sum(lostDealsToday, 'Amount'),
            lost_reasons: countBy(lostDealsToday, 'Reason_For_Loss__s'),

            // Pipeline
            pipeline_open_count: pipelineDeals.length,
            pipeline_open_amount: sum(pipelineDeals, 'Amount'),
            // Weighted = Amount * Probability / 100
            pipeline_weighted: pipelineDeals.reduce((acc, d) => acc + (parseFloat(d.Amount || 0) * (parseInt(d.Probability || 0) / 100)), 0),
            pipeline_by_stage: countBy(pipelineDeals, 'Stage'),

            // Cycle - average of today's won deals?
            avg_sales_cycle_days: average(wonDealsToday, 'Sales_Cycle_Duration'),

            // Outstanding Balance (Total snapshot)
            total_saldo_restante: sum(deptDeals, 'Saldo_Restante')
        };

        const { error } = await supabase
            .from('daily_deal_snapshot')
            .upsert(snapshot, { onConflict: 'snapshot_date' });

        if (error) console.error('Error saving Deal Snapshot:', error);
        else console.log('Deal Snapshot saved successfully.');
    }
};
