/**
 * User Extractor
 * Provides user ID to name mapping
 * 
 * Note: COQL queries to 'users' table require special OAuth scopes that may not be available.
 * Instead, we use a manual mapping based on the active users in the system.
 * This mapping should be updated periodically or fetched from a different source.
 */

// Manual mapping of user IDs to full names
// Last updated: 2026-02-05 via Zoho REST API
const USER_MAPPING: Record<string, string> = {
    '829550000000485001': 'Leonardo Saraiva',
    '829550000000589002': 'Sofia Falcato',
    '829550000000589019': 'Rebeca Alves',
    '829550000000589036': 'Rafael Lucas',
    '829550000000589195': 'Talita Alves',
    '829550000000933001': 'Kenya Lampert',
    '829550000002140001': 'Felipe Valentin',
    '829550000002703025': 'Wellen Novato',
    '829550000003416010': 'Eliane Almeida',
    '829550000005497055': 'Vinicius Novato',
    '829550000007171001': 'Receção',
    '829550000011590001': 'Suzana Crista'
};

export const UserExtractor = {
    /**
     * Get all active users
     * Returns a mapping of user ID to full name
     */
    async getAllActiveUsers(): Promise<Record<string, string>> {
        // Return the manual mapping
        // In the future, this could be enhanced to fetch from an API or database
        return USER_MAPPING;
    },

    /**
     * Get all users with their details
     */
    async getAllUsers() {
        // Convert mapping to array of user objects
        return Object.entries(USER_MAPPING).map(([id, full_name]) => ({
            id,
            full_name
        }));
    }
};
