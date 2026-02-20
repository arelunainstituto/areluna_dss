/**
 * Normalizes interest categories to group similar variations.
 * - Removes prefixes like [DIEGO], [NOME], etc.
 * - Normalizes case sensitivity
 * - Groups similar categories (e.g., "Implantes Dentários" → "Implantes")
 */
export function normalizeInterest(interest: string | null | undefined): string {
    if (!interest) return 'Unknown';

    // Remove prefixos entre colchetes (ex: [DIEGO] Implantes → Implantes)
    let normalized = interest.replace(/^\[.*?\]\s*/g, '').trim();

    // Normaliza para lowercase para comparação
    const lower = normalized.toLowerCase();

    // Agrupa variações de implantes
    if (lower.includes('implante')) {
        return 'Implantes';
    }

    // Agrupa variações de facetas
    if (lower.includes('faceta')) {
        return 'Facetas';
    }

    // Agrupa variações de alinhadores
    if (lower.includes('alinhador')) {
        return 'Alinhadores';
    }

    // Agrupa variações de ortodontia
    if (lower.includes('ortodont')) {
        return 'Ortodontia';
    }

    // Agrupa variações de clareamento
    if (lower.includes('clarear')) {
        return 'Clareamento';
    }

    // Retorna com primeira letra maiúscula
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}
