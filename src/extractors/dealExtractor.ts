import { fetchAllRecords } from '../utils/coqlHelper';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = process.env.TIMEZONE || 'Europe/Lisbon';
const formatDate = (date: dayjs.Dayjs) => date.format('YYYY-MM-DD'); // Deals often use DATE type, checks needed
const formatDateTime = (date: dayjs.Dayjs) => date.format('YYYY-MM-DDTHH:mm:ss+00:00');

export const DealExtractor = {
    // Q-D1: Won Deals (All time / General fetch, limited usually but here maybe broad)
    // Warning: Fetching *all* won deals might be huge. Usually restricted by date.
    // The Prompt implies "Deals criados hoje" type logic or aggregating.
    // But Q-D1 in prompt has no date filter? "SELECT ... LIMIT 200". 
    // We'll add a filter for "Last 30 days" or similar if typically used for monthly stats, 
    // or just fetch latest 200 as per prompt logic if it's for a "Recent Sales" list.
    // However, for aggregation/metrics, we usually need specific periods.

    // Q-D2: Won Deals Current Month
    async getWonDealsCurrentMonth() {
        const start = dayjs().tz(TIMEZONE).startOf('month').format('YYYY-MM-DD');
        const end = dayjs().tz(TIMEZONE).endOf('day').format('YYYY-MM-DD');

        const query = `
      SELECT id, Amount, Interesses, Unidade_Atendimento, Doutor_Respons_vel,
             Owner, Closing_Date, Valor_de_Entrada, Saldo_Restante,
             Lead_Source, Sales_Cycle_Duration, SDR
      FROM Deals
      WHERE Stage in ('Ganho fechado', 'Procedimento Fechado', 'Procedimento Fechado.')
        AND Closing_Date between '${start}' and '${end}'
      ORDER BY Closing_Date DESC
    `;
        return fetchAllRecords(query);
    },

    // Q-D3: Open Pipeline
    async getOpenPipeline() {
        const query = `
      SELECT id, Deal_Name, Amount, Stage, Pipeline, Probability, Owner,
             Interesses, Unidade_Atendimento, Created_Time, Modified_Time
      FROM Deals
      WHERE Stage not in ('Ganho fechado', 'Procedimento Fechado', 'Procedimento Fechado.',
            'Perda fechada', 'Perda fechada para a concorrência', 'Perda Fechada Adiada',
            'Sem interesse', 'Sem_interesse')
      ORDER BY Modified_Time DESC
    `;
        return fetchAllRecords(query);
    },

    // Q-D4: Lost Deals Current Month
    async getLostDealsCurrentMonth() {
        const start = dayjs().tz(TIMEZONE).startOf('month').format('YYYY-MM-DD');
        const end = dayjs().tz(TIMEZONE).endOf('day').format('YYYY-MM-DD');

        const query = `
      SELECT id, Amount, Stage, Reason_For_Loss__s, Owner, Interesses,
             Unidade_Atendimento, Lead_Source, Closing_Date
      FROM Deals
      WHERE Stage in ('Perda fechada', 'Perda fechada para a concorrência', 'Perda Fechada Adiada')
        AND Closing_Date between '${start}' and '${end}'
      ORDER BY Closing_Date DESC
    `;
        return fetchAllRecords(query);
    },

    // Q-D5: Outstanding Balance (Inadimplência)
    async getDealsWithOutstandingBalance() {
        // Note: Saldo_Restante > 0. 
        // This query might return ALOT of historical data if we don't filter by date.
        // For now, following prompt exactly.
        const query = `
      SELECT id, Deal_Name, Amount, Saldo_Restante, Valor_de_Entrada,
             Quantidade_de_Parcelas, Owner, Closing_Date
      FROM Deals
      WHERE Saldo_Restante > 0
        AND Stage in ('Ganho fechado', 'Procedimento Fechado', 'Procedimento Fechado.')
      ORDER BY Saldo_Restante DESC
    `;
        return fetchAllRecords(query);
    },

    // Q-D6: Weighted Forecast (Sales Pipeline)
    async getWeightedForecast() {
        const query = `
      SELECT id, Amount, Probability, Stage, Pipeline, Owner, Interesses
      FROM Deals
      WHERE Pipeline = 'VENDAS'
        AND Stage not in ('Ganho fechado', 'Procedimento Fechado', 'Procedimento Fechado.',
            'Perda fechada', 'Perda fechada para a concorrência', 'Perda Fechada Adiada')
    `;
        return fetchAllRecords(query);
    },

    // Q-D7: SDR Pipeline Efficiency
    async getSDRPipelineDeals() {
        const query = `
      SELECT id, Deal_Name, Stage, Owner, SDR, Created_Time, Modified_Time, Pipeline
      FROM Deals
      WHERE Pipeline = 'SDR - Instituto AreLuna'
      ORDER BY Modified_Time DESC
    `;
        return fetchAllRecords(query);
    },

    // Q-D8: Pending Contracts (Alert A3)
    async getPendingContracts() {
        const query = `
      SELECT id, Deal_Name, Status_Contrato, Owner, Closing_Date, Amount
      FROM Deals
      WHERE Status_Contrato = 'Não gerado'
        AND Stage in ('Ganho fechado', 'Procedimento Fechado', 'Procedimento Fechado.')
      ORDER BY Closing_Date DESC
    `;
        return fetchAllRecords(query);
    },

    // Q-D9: Deals without Down Payment (Alert A4)
    async getDealsWithoutDownPayment() {
        const query = `
      SELECT id, Deal_Name, Amount, Valor_de_Entrada, Owner, Closing_Date
      FROM Deals
      WHERE Stage in ('Ganho fechado', 'Procedimento Fechado', 'Procedimento Fechado.')
        AND (Valor_de_Entrada is null or Valor_de_Entrada = 0)
      ORDER BY Closing_Date DESC
    `;
        return fetchAllRecords(query);
    },

    // Q-D10: Deals Created Current Month (for Conversion Rate)
    async getDealsCreatedCurrentMonth() {
        const start = dayjs().tz(TIMEZONE).startOf('month').utc();
        const end = dayjs().tz(TIMEZONE).endOf('day').utc();

        const query = `
      SELECT id, Stage, Owner, Pipeline, Created_Time, Closing_Date
      FROM Deals
      WHERE Created_Time between '${formatDateTime(start)}' and '${formatDateTime(end)}'
      ORDER BY Created_Time DESC
    `;
        return fetchAllRecords(query);
    }
};
