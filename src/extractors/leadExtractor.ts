import { fetchAllRecords } from '../utils/coqlHelper';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = process.env.TIMEZONE || 'Europe/Lisbon';

// Helper to format date for COQL
const formatDate = (date: dayjs.Dayjs) => date.format('YYYY-MM-DDTHH:mm:ss+00:00');

export const LeadExtractor = {
    // Q-L1: Leads created today
    async getLeadsCreatedToday() {
        // Note: COQL 'today' keyword usage vs explicit dates. 
        // Explicit dates are safer for timezone consistency.
        const startOfDay = dayjs().tz(TIMEZONE).startOf('day').utc();
        const endOfDay = dayjs().tz(TIMEZONE).endOf('day').utc();

        // Using simple 'today' might use Zoho server time which could differ. 
        // Let's stick to explicit range if possible, or try 'today' if timezone matches.
        // Given the request example used explicit ISO strings, we follow that pattern.

        const query = `
      SELECT id, Lead_Source, Lead_Status, Interesses, Unidade_Atendimento,
             Owner, Created_Time, Country, Em_que_pa_s_voc_mora, City,
             Cost_per_Conversion, Ad_Campaign_Name
      FROM Leads
      WHERE Created_Time between '${formatDate(startOfDay)}' and '${formatDate(endOfDay)}'
      ORDER BY Created_Time DESC
    `;
        return fetchAllRecords(query);
    },

    // Q-L2: Leads created last 7 days
    async getLeadsLast7Days() {
        const start = dayjs().subtract(7, 'day').tz(TIMEZONE).startOf('day').utc();
        const end = dayjs().tz(TIMEZONE).endOf('day').utc();

        const query = `
      SELECT id, Lead_Source, Lead_Status, Interesses, Unidade_Atendimento,
             Owner, Created_Time, Country, Cost_per_Conversion, Ad_Campaign_Name
      FROM Leads
      WHERE Created_Time between '${formatDate(start)}' and '${formatDate(end)}'
      ORDER BY Created_Time DESC
    `;
        return fetchAllRecords(query);
    },

    // Q-L3: Leads created current month
    async getLeadsCurrentMonth() {
        const start = dayjs().tz(TIMEZONE).startOf('month').utc();
        const end = dayjs().tz(TIMEZONE).endOf('day').utc();

        const query = `
      SELECT id, Lead_Source, Lead_Status, Interesses, Unidade_Atendimento,
             Owner, Created_Time, Cost_per_Conversion, Ad_Campaign_Name
      FROM Leads
      WHERE Created_Time between '${formatDate(start)}' and '${formatDate(end)}'
      ORDER BY Created_Time DESC
    `;
        return fetchAllRecords(query);
    },

    // Q-L4: Qualified vs Non-qualified
    async getLeadsByQuality(startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) {
        const query = `
      SELECT id, Lead_Source, Lead_Status, Interesses
      FROM Leads
      WHERE Lead_Status in ('Qualificado', 'Não qualificado', 'Video Chamada Confirmada',
            'Avaliação Agendada', 'Consulta de Avaliação', 'Não tem interesse',
            'Informação Incorretas', 'Blacklist')
        AND Created_Time between '${formatDate(startDate)}' and '${formatDate(endDate)}'
      ORDER BY Created_Time DESC
    `;
        return fetchAllRecords(query);
    },

    // Q-L5: Video scheduled today (Alert A2)
    async getVideosScheduledToday() {
        const start = dayjs().tz(TIMEZONE).startOf('day').utc();
        const end = dayjs().tz(TIMEZONE).endOf('day').utc();

        const query = `
      SELECT id, First_Name, Last_Name, Lead_Status, Owner, Agendamento_Video
      FROM Leads
      WHERE Agendamento_Video between '${formatDate(start)}' and '${formatDate(end)}'
      ORDER BY Agendamento_Video ASC
    `;
        return fetchAllRecords(query);
    },

    // Q-L6: Untouched leads > 2h (Alert A1)
    async getUntouchedLeads() {
        const startOfToday = dayjs().tz(TIMEZONE).startOf('day').utc();
        const twoHoursAgo = dayjs().subtract(2, 'hour').utc();

        const query = `
      SELECT id, First_Name, Last_Name, Lead_Source, Owner, Created_Time
      FROM Leads
      WHERE Lead_Status = '1a Tentativa de contato'
        AND Created_Time between '${formatDate(startOfToday)}' and '${formatDate(twoHoursAgo)}'
      ORDER BY Created_Time ASC
    `;
        return fetchAllRecords(query);
    },

    // Q-L7: Show Rate
    async getShowRateData(startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) {
        const query = `
      SELECT id, Lead_Status
      FROM Leads
      WHERE Lead_Status in ('Video Chamada Confirmada', 'Não compareceu a vídeo',
            'Video Chamada Agendada')
        AND Modified_Time between '${formatDate(startDate)}' and '${formatDate(endDate)}'
    `;
        return fetchAllRecords(query);
    },

    // Q-L8: Repescagem
    async getRepescagemConverted() {
        const query = `
      SELECT id, Lead_Source, Converted__s, Created_Time
      FROM Leads
      WHERE Lead_Source = 'Repescagem RD'
      ORDER BY Created_Time DESC
    `;
        return fetchAllRecords(query);
    },

    // Q-L9: Converted Leads details
    async getConvertedLeadsCurrentMonth() {
        const start = dayjs().tz(TIMEZONE).startOf('month').utc();
        const end = dayjs().tz(TIMEZONE).endOf('day').utc();

        const query = `
      SELECT id, Lead_Source, Owner, Lead_Conversion_Time, Converted_Date_Time,
             Created_Time, Interesses, Unidade_Atendimento
      FROM Leads
      WHERE Converted__s = true
        AND Converted_Date_Time between '${formatDate(start)}' and '${formatDate(end)}'
      ORDER BY Converted_Date_Time DESC
    `;
        return fetchAllRecords(query);
    }
};
