import axios from 'axios';
import { ENV } from '../config/env';

/**
 * Cache for owner names to avoid repeated API calls
 */
const ownerCache = new Map<string, string>();

/**
 * Fetches owner/user name from Zoho CRM Users API
 * Uses the same Zoho Function URL but with a different query
 */
async function fetchOwnerName(ownerId: string): Promise<string> {
    // Check cache first
    if (ownerCache.has(ownerId)) {
        return ownerCache.get(ownerId)!;
    }

    try {
        // Try to fetch user info using COQL
        const query = `SELECT id, full_name, email FROM users WHERE id = '${ownerId}'`;
        const argumentValue = JSON.stringify({ consulta: query });

        const urlObj = new URL(ENV.ZOHO.URL);
        urlObj.searchParams.append('arguments', argumentValue);

        const response = await axios.get(urlObj.toString());

        // Parse the response (same format as other Zoho queries)
        if (response.data?.details?.output) {
            const parsedOutput = JSON.parse(response.data.details.output);
            if (parsedOutput?.data && parsedOutput.data.length > 0) {
                const userName = parsedOutput.data[0].full_name || parsedOutput.data[0].email || ownerId;
                ownerCache.set(ownerId, userName);
                return userName;
            }
        }
    } catch (error: any) {
        console.warn(`Failed to fetch owner name for ID ${ownerId}:`, error.message);
    }

    // Fallback: use last 6 digits
    const fallbackName = `Gestor-${ownerId.slice(-6)}`;
    ownerCache.set(ownerId, fallbackName);
    return fallbackName;
}

/**
 * Fetches multiple owner names in batch
 */
export async function fetchOwnerNames(ownerIds: string[]): Promise<Map<string, string>> {
    const uniqueIds = [...new Set(ownerIds)];
    const results = new Map<string, string>();

    for (const id of uniqueIds) {
        const name = await fetchOwnerName(id);
        results.set(id, name);
    }

    return results;
}

/**
 * Extracts owner ID from Zoho Owner object
 */
export function extractOwnerId(owner: any): string {
    if (!owner) return 'Unknown';
    if (typeof owner === 'string') return owner;
    if (typeof owner === 'object' && owner !== null && owner.id) {
        return String(owner.id);
    }
    return 'Unknown';
}

/**
 * Gets display name for an owner (with caching)
 */
export async function getOwnerDisplayName(owner: any): Promise<string> {
    const ownerId = extractOwnerId(owner);
    if (ownerId === 'Unknown') return 'Unknown';

    return await fetchOwnerName(ownerId);
}

/**
 * Clears the owner name cache (useful for testing)
 */
export function clearOwnerCache(): void {
    ownerCache.clear();
}
