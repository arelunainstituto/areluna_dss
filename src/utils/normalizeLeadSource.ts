/**
 * Normalizes Lead_Source values to ensure consistent grouping
 * Handles variations in capitalization, spacing, and naming
 */
export function normalizeLeadSource(source: string | null | undefined): string {
    if (!source) return 'Desconhecido';

    const normalized = source.trim().toLowerCase().replace(/\s+/g, ' ');

    // Meta/Facebook Ads variations
    if (normalized.includes('meta') && normalized.includes('ads')) {
        return 'Meta ADS';
    }
    if (normalized.includes('facebook') && normalized.includes('ads')) {
        return 'Meta ADS';
    }

    // Google Ads variations
    if (normalized.includes('google') && normalized.includes('ads')) {
        return 'Google ADS';
    }
    if (normalized.includes('google adwords')) {
        return 'Google ADS';
    }

    // Instagram variations
    if (normalized.includes('instagram') || normalized.includes('ig')) {
        return 'Instagram';
    }

    // WhatsApp variations
    if (normalized.includes('whatsapp') || normalized.includes('wpp')) {
        return 'WhatsApp';
    }

    // Indicação/Referral variations
    if (normalized.includes('indicação') || normalized.includes('indicacao') ||
        normalized.includes('referral') || normalized.includes('referência')) {
        return 'Indicação';
    }

    // Website variations
    if (normalized.includes('website') || normalized.includes('site')) {
        return 'Website';
    }

    // RD Station variations
    if (normalized.includes('rd') || normalized.includes('repescagem')) {
        return 'Repescagem RD';
    }

    // LinkedIn variations
    if (normalized.includes('linkedin')) {
        return 'LinkedIn';
    }

    // Email variations
    if (normalized.includes('email') || normalized.includes('e-mail')) {
        return 'Email';
    }

    // Telefone variations
    if (normalized.includes('telefone') || normalized.includes('phone') ||
        normalized.includes('ligação') || normalized.includes('ligacao')) {
        return 'Telefone';
    }

    // Evento variations
    if (normalized.includes('evento') || normalized.includes('event')) {
        return 'Evento';
    }

    // Parceiro variations
    if (normalized.includes('parceiro') || normalized.includes('partner')) {
        return 'Parceiro';
    }

    // If no match, return capitalized version
    return source.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}
