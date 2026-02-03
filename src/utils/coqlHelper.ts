import { zohoClient } from '../config/zoho';

export const MAX_RECORDS_PER_PAGE = 200;

/**
 * Validates a COQL query structure to ensure it is suitable for pagination.
 * @param query The COQL query string.
 * @returns true if valid, throws error otherwise.
 */
function validateQuery(query: string): boolean {
    const upperQuery = query.toUpperCase();
    if (!upperQuery.includes('SELECT') || !upperQuery.includes('FROM')) {
        throw new Error('Invalid COQL Query: Must contain SELECT and FROM clauses.');
    }
    // We handle LIMIT and OFFSET automatically, so warn or strip if present?
    // Ideally, the caller shouldn't provide them.
    if (upperQuery.includes('LIMIT') || upperQuery.includes('OFFSET')) {
        console.warn('COQL Query Warning: LIMIT/OFFSET detected. Pagination logic might override or conflict.');
    }
    return true;
}

/**
 * Fetches all records for a given COQL query, handling pagination automatically.
 * Warning: This fetches ALL matching records in memory. Use with caution for large datasets.
 * @param baseQuery The COQL query string without LIMIT or OFFSET.
 * @returns A promise resolving to an array of all fetched records.
 */
export async function fetchAllRecords(baseQuery: string): Promise<any[]> {
    validateQuery(baseQuery);

    let allRecords: any[] = [];
    let offset = 0;
    let hasMore = true;

    // Simple safety valve to prevent infinite loops or massive memory usage
    const SAFETY_MAX_LOOPS = 500; // 500 * 200 = 100k records max
    let loopCount = 0;

    while (hasMore && loopCount < SAFETY_MAX_LOOPS) {
        loopCount++;
        // Construct query with pagination
        // COQL syntax for limit/offset: LIMIT 200 OFFSET 0
        const paginatedQuery = `${baseQuery} LIMIT ${MAX_RECORDS_PER_PAGE} OFFSET ${offset}`;

        try {
            const response = await zohoClient.coqlRequest(paginatedQuery);

            // Zoho Function returns: { code: 'success', details: { output: '{"data":[...]}' } }
            // The output is a JSON STRING that needs to be parsed
            let parsedOutput;

            if (response?.details?.output) {
                try {
                    parsedOutput = JSON.parse(response.details.output);
                } catch (parseError) {
                    console.error('Failed to parse Zoho output:', response.details.output);
                    throw new Error('Invalid JSON in Zoho response');
                }
            } else {
                parsedOutput = response;
            }

            // Check for Zoho API errors in the parsed output
            if (parsedOutput.status === 'error') {
                throw new Error(`Zoho API Error: ${parsedOutput.message} (${parsedOutput.code})`);
            }

            // Extract the data array
            const records = parsedOutput.data || [];

            if (!Array.isArray(records)) {
                console.warn('Unexpected response format:', parsedOutput);
                throw new Error('Unexpected response format from Zoho COQL: "data" is not an array.');
            }

            allRecords = allRecords.concat(records);

            if (records.length < MAX_RECORDS_PER_PAGE) {
                hasMore = false;
            } else {
                offset += MAX_RECORDS_PER_PAGE;
            }

        } catch (error) {
            console.error(`Error fetching page at offset ${offset}:`, error);
            throw error;
        }
    }

    if (loopCount >= SAFETY_MAX_LOOPS) {
        console.warn(`fetchAllRecords hit safety limit of ${SAFETY_MAX_LOOPS} pages. Results may be truncated.`);
    }

    return allRecords;
}
