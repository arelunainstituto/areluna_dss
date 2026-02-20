/**
 * Owner ID to Name Mapping
 * 
 * This module provides utilities to extract owner information from Zoho CRM Owner objects.
 * The Owner field in Zoho returns an object with: { name, id, email }
 */

import { UserExtractor } from '../extractors/userExtractor';

// Manual owner mappings (these take precedence over auto-fetched data)
export const MANUAL_OWNER_NAMES: Record<string, string> = {
    // Add manual overrides here if needed
    // Format: 'OWNER_ID': 'Owner Full Name'
};

// Cache for auto-fetched user mappings
let cachedUserMappings: Map<string, string> | null = null;

/**
 * Fetches and caches user mappings from Zoho CRM
 */
async function fetchUserMappings(): Promise<Map<string, string>> {
    if (cachedUserMappings) {
        return cachedUserMappings;
    }

    try {
        const userRecord = await UserExtractor.getAllActiveUsers();
        const mapping = new Map<string, string>(Object.entries(userRecord));

        console.log(`Fetched ${mapping.size} user mappings from Zoho API`);
        cachedUserMappings = mapping; // Cache the result
        return mapping;
    } catch (error) {
        console.warn('Failed to fetch users from Zoho API, falling back to manual mapping:', error instanceof Error ? error.message : error);
        // Fall back to manual mapping
        const manualMapping = new Map(Object.entries(MANUAL_OWNER_NAMES));
        cachedUserMappings = manualMapping; // Cache the manual mapping as fallback
        return manualMapping;
    }
}

/**
 * Gets all owner mappings (manual + auto-fetched)
 * Manual mappings take precedence
 */
export async function getAllOwnerMappings(): Promise<Record<string, string>> {
    const autoFetchedMap = await fetchUserMappings();
    // Convert Map to Record
    const autoFetched: Record<string, string> = {};
    autoFetchedMap.forEach((value, key) => {
        autoFetched[key] = value;
    });
    return { ...autoFetched, ...MANUAL_OWNER_NAMES };
}

/**
 * Clears the cached user mappings (useful for refresh)
 */
export function clearUserMappingsCache(): void {
    cachedUserMappings = null;
}

/**
 * Gets the display name for an owner ID
 * Falls back to "Gestor-XXXXXX" if not found in mapping
 */
export async function getOwnerDisplayName(ownerId: string): Promise<string> {
    if (!ownerId || ownerId === 'Unknown') {
        return 'Unknown';
    }

    // Get all mappings (manual + auto-fetched)
    const allMappings = await getAllOwnerMappings();

    // Check if we have a mapping
    if (allMappings[ownerId]) {
        return allMappings[ownerId];
    }

    // Fallback to showing last 6 digits
    return `Gestor-${ownerId.slice(-6)}`;
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
 * Extracts owner name from Zoho Owner object
 * The Owner field returns an object: { name: string, id: string, email: string }
 * This is the PREFERRED method - no API lookup needed!
 */
export function extractOwnerName(owner: any): string {
    if (!owner) return 'Sem Gestor';

    // If it's already a string, return it
    if (typeof owner === 'string') return owner;

    // If it's an object with a name property, use it directly
    if (typeof owner === 'object' && owner !== null && owner.name) {
        return owner.name;
    }

    // Fallback
    return 'Sem Gestor';
}

/**
 * Gets display name from owner object
 * Handles both REST API format (with name) and COQL format (ID only)
 */
export async function getOwnerName(owner: any): Promise<string> {
    // First try direct extraction (works for REST API format with name field)
    const directName = extractOwnerName(owner);
    if (directName !== 'Sem Gestor') {
        return directName;
    }

    // If direct extraction returned 'Sem Gestor', check if we have an ID to lookup
    // This handles COQL format where Owner = { id: "..." } without name
    const ownerId = extractOwnerId(owner);
    if (ownerId !== 'Unknown') {
        return await getOwnerDisplayName(ownerId);
    }

    return 'Sem Gestor';
}

