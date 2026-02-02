const MarketingCharts = {
    sourceChart: null,
    interestChart: null,

    render(data) {
        this.updateKPIs(data.primary);
        this.renderSourceChart(data.primary.bySource);
        this.renderInterestChart(data.primary.byInterest);
    },

    updateKPIs(metrics) {
        const container = document.getElementById('marketing-kpis');
        if (!container || !metrics) return;

        container.innerHTML = `
            <div class="kpi-card">
                <span class="kpi-title">Leads Hoje</span>
                <span class="kpi-value">${Utils.formatNumber(metrics.leadsToday)}</span>
            </div>
            <div class="kpi-card">
                <span class="kpi-title">Leads Mês</span>
                <span class="kpi-value">${Utils.formatNumber(metrics.leadsMonth)}</span>
            </div>
        `;
    },

    renderSourceChart(sourceData) {
        const ctx = document.getElementById('mkt-source-chart');
        if (!ctx || !sourceData) return;

        const labels = Object.keys(sourceData);
        const values = Object.values(sourceData);

        if (this.sourceChart) this.sourceChart.destroy();

        this.sourceChart = new Chart(ctx, {
            type: 'bar', // Horizontal bar?
            data: {
                labels: labels,
                datasets: [{
                    label: 'Leads',
                    data: values,
                    backgroundColor: '#d29922',
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

    renderInterestChart(interestData) {
        const ctx = document.getElementById('mkt-interest-chart');
        if (!ctx || !interestData) return;

        const labels = Object.keys(interestData);
        const values = Object.values(interestData);

        if (this.interestChart) this.interestChart.destroy();

        this.interestChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: ['#1f6feb', '#238636', '#d29922', '#a371f7', '#f85149'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right', labels: { color: '#8b949e' } } }
            }
        });
    }
};
