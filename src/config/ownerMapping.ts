/**
 * Owner ID to Name Mapping
 * 
 * Since Zoho COQL doesn't support querying the Users table,
 * we maintain a manual mapping of Owner IDs to names.
 * 
 * To update this mapping:
 * 1. Go to Zoho CRM > Setup > Users
 * 2. Note down the User ID and Full Name
 * 3. Add to the OWNER_NAMES object below
 */

export const OWNER_NAMES: Record<string, string> = {
    // Add your owner mappings here
    // Format: 'OWNER_ID': 'Owner Full Name'

    // Example mappings (replace with actual IDs from your Zoho CRM):
    // '829550000011590001': 'Dr. Leo',
    // '829550000000589195': 'Eliane Almeida',
    // '829550000002140001': 'Felipe Valentin',
    // '829550000000589019': 'Nicaela Cabral',
};

/**
 * Gets the display name for an owner ID
 * Falls back to "Gestor-XXXXXX" if not found in mapping
 */
export function getOwnerDisplayName(ownerId: string): string {
    if (!ownerId || ownerId === 'Unknown') {
        return 'Unknown';
    }

    // Check if we have a mapping
    if (OWNER_NAMES[ownerId]) {
        return OWNER_NAMES[ownerId];
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
 * Gets display name from owner object
 */
export function getOwnerName(owner: any): string {
    const ownerId = extractOwnerId(owner);
    return getOwnerDisplayName(ownerId);
}
