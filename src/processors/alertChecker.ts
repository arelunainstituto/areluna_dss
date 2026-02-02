import { LeadExtractor } from '../extractors/leadExtractor';
import { DealExtractor } from '../extractors/dealExtractor';
import { supabase } from '../config/supabase';

export const AlertChecker = {
    async runChecks() {
        console.log('Running Alert Checks...');

        // A1: Virgin Leads > 2h
        const untouchedLeads = await LeadExtractor.getUntouchedLeads();
        if (untouchedLeads.length > 0) {
            await this.logAlert('lead_virgin', untouchedLeads.length + ' leads untouched > 2h', { count: untouchedLeads.length });
        }

        // A2: Videos Scheduled Today
        const videosToday = await LeadExtractor.getVideosScheduledToday();
        if (videosToday.length > 0) {
            await this.logAlert('video_today', videosToday.length + ' videos scheduled today', { count: videosToday.length });
        }

        // A3: Pending Contracts
        const pendingContracts = await DealExtractor.getPendingContracts();
        if (pendingContracts.length > 0) {
            await this.logAlert('contract_pending', pendingContracts.length + ' pending contracts', { count: pendingContracts.length });
        }

        // A4: No Down Payment
        const noEntryDeals = await DealExtractor.getDealsWithoutDownPayment();
        if (noEntryDeals.length > 0) {
            console.warn('Alert: Deals without down payment found:', noEntryDeals.length);
            await this.logAlert('no_entrada', noEntryDeals.length + ' deals without entry payment', { ids: noEntryDeals.map(d => d.id) });
        }
    },

    async logAlert(type: string, name: string, details: any) {
        const { error } = await supabase
            .from('alert_log')
            .insert({
                alert_type: type,
                record_name: name,
                details: details,
                resolved: false
            });

        if (error) console.error('Error logging alert:', error);
    }
};
