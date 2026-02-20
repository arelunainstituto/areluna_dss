import axios from 'axios';
import { ENV } from './env';

class ZohoClient {
    constructor() { }

    /**
     * Executes a COQL query via the Zoho Function API.
     * @param query The COQL query string.
     * @returns The JSON response from Zoho.
     */
    public async coqlRequest(query: string): Promise<any> {
        let url = ENV.ZOHO.URL;

        // The user provided URL already contains auth_type and zapikey in the query string.
        // We just need to append 'arguments'.
        // To safely append, we can check if it already has search params.

        const argumentValue = JSON.stringify({ consulta: query });

        // Use URL object to handle params parsing/appending
        const urlObj = new URL(url);
        urlObj.searchParams.append('arguments', argumentValue);

        try {
            const response = await axios.get(urlObj.toString(), { timeout: 30000 });

            // The response structure from a custom function usually contains "details.output" stringified or direct JSON
            // We'll need to parse it based on the specific return format of 'leads_report'.
            // For now, returning the whole data or a specific field if it's standard convention.
            return response.data;

        } catch (error: any) {
            console.error('Zoho ZAPIKEY Request Failed:', error.response?.data || error.message);
            throw error;
        }
    }
}

export const zohoClient = new ZohoClient();
