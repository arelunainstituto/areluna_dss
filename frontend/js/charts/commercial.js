const CommercialCharts = {
    funnelChart: null,
    conversionChart: null,

    render(data) {
        this.updateKPIs(data.primary);
        this.renderFunnelChart(data.primary.funnel);
        this.renderConversionChart(data.primary.conversionByOwner);
    },

    updateKPIs(metrics) {
        const container = document.getElementById('commercial-kpis');
        if (!container || !metrics) return;

        container.innerHTML = `
            <div class="kpi-card">
                <span class="kpi-title">Taxa Conversão Global</span>
                <span class="kpi-value">${Utils.formatPercent(metrics.globalConversion)}</span>
            </div>
             <div class="kpi-card">
                <span class="kpi-title">Deals Ganhos</span>
                <span class="kpi-value">${Utils.formatNumber(metrics.dealsWon)}</span>
                <span class="kpi-trend positive">Current Month</span>
            </div>
            <div class="kpi-card">
                <span class="kpi-title">Deals Perdidos</span>
                <span class="kpi-value">${Utils.formatNumber(metrics.dealsLost)}</span>
            </div>
            <div class="kpi-card">
                <span class="kpi-title">Pipeline Aberto</span>
                <span class="kpi-value">${Utils.formatNumber(metrics.dealsOpen)}</span>
            </div>
        `;
    },

    renderFunnelChart(funnelData) {
        const ctx = document.getElementById('comm-funnel-chart');
        if (!ctx || !funnelData) return;

        // Sort stages if necessary (requires predefined order)
        const labels = Object.keys(funnelData);
        const values = Object.values(funnelData);

        if (this.funnelChart) this.funnelChart.destroy();

        this.funnelChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Deals',
                    data: values,
                    backgroundColor: '#1f6feb',
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: 'rgba(255,255,255,0.05)' } },
                    y: { grid: { display: false } }
                }
            }
        });
    },

    renderConversionChart(conversionData) {
        const ctx = document.getElementById('comm-conversion-chart');
        if (!ctx || !conversionData) return;

        const labels = Object.keys(conversionData);
        const values = Object.values(conversionData);

        if (this.conversionChart) this.conversionChart.destroy();

        this.conversionChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Conversão %',
                    data: values,
                    backgroundColor: '#238636',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    x: { grid: { display: false } }
                }
            }
        });
    }
};
