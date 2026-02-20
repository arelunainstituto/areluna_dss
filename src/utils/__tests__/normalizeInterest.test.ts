import { normalizeInterest } from '../normalizeInterest';

describe('normalizeInterest', () => {
    it('should return "Unknown" for null or undefined', () => {
        expect(normalizeInterest(null)).toBe('Unknown');
        expect(normalizeInterest(undefined)).toBe('Unknown');
    });

    it('should remove prefixes in brackets', () => {
        expect(normalizeInterest('[DIEGO] Implantes')).toBe('Implantes');
        expect(normalizeInterest('[MARIA] Facetas')).toBe('Facetas');
        expect(normalizeInterest('[JOÃO] Alinhadores')).toBe('Alinhadores');
    });

    it('should normalize implant variations', () => {
        expect(normalizeInterest('Implantes')).toBe('Implantes');
        expect(normalizeInterest('implantes')).toBe('Implantes');
        expect(normalizeInterest('Implantes Dentários')).toBe('Implantes');
        expect(normalizeInterest('[DIEGO] Implantes')).toBe('Implantes');
    });

    it('should normalize facet variations', () => {
        expect(normalizeInterest('Facetas')).toBe('Facetas');
        expect(normalizeInterest('facetas')).toBe('Facetas');
        expect(normalizeInterest('Facetas de Porcelana')).toBe('Facetas');
    });

    it('should normalize aligner variations', () => {
        expect(normalizeInterest('Alinhadores')).toBe('Alinhadores');
        expect(normalizeInterest('alinhadores')).toBe('Alinhadores');
        expect(normalizeInterest('Alinhadores Invisíveis')).toBe('Alinhadores');
    });

    it('should normalize orthodontics variations', () => {
        expect(normalizeInterest('Ortodontia')).toBe('Ortodontia');
        expect(normalizeInterest('ortodontia')).toBe('Ortodontia');
    });

    it('should normalize whitening variations', () => {
        expect(normalizeInterest('Clareamento')).toBe('Clareamento');
        expect(normalizeInterest('clareamento')).toBe('Clareamento');
        expect(normalizeInterest('Clareamento Dental')).toBe('Clareamento');
    });

    it('should capitalize first letter for unknown categories', () => {
        expect(normalizeInterest('outro serviço')).toBe('Outro serviço');
        expect(normalizeInterest('CONSULTA')).toBe('CONSULTA');
    });
});
