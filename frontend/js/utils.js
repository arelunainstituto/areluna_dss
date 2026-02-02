const Utils = {
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
    },
    formatNumber(value) {
        return new Intl.NumberFormat('pt-PT').format(value);
    },
    formatPercent(value) {
        return new Intl.NumberFormat('pt-PT', { style: 'percent', minimumFractionDigits: 1 }).format(value / 100);
    }
};
