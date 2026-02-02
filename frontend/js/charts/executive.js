const ExecutiveCharts = {
    revenueChart: null,
    unitChart: null,

    render(data) {
        this.updateKPIs(data.primary);
        this.renderRevenueChart(data.secondary.history);
        this.renderUnitChart(data.primary.revenueByUnit);
    },

    updateKPIs(metrics) {
        const container = document.getElementById('executive-kpis');
        if (!container || !metrics) return;

        container.innerHTML = `
            <div class="kpi-card">
                <span class="kpi-title">Receita Total</span>
                <span class="kpi-value">${Utils.formatCurrency(metrics.totalRevenue)}</span>
            </div>
            <div class="kpi-card">
                <span class="kpi-title">Cash In (Entrada)</span>
                <span class="kpi-value">${Utils.formatCurrency(metrics.cashIn)}</span>
            </div>
             <div class="kpi-card">
                <span class="kpi-title">Ticket Médio</span>
                <span class="kpi-value">${Utils.formatCurrency(metrics.avgTicket)}</span>
            </div>
            <div class="kpi-card">
                <span class="kpi-title">Forecast Ponderado</span>
                <span class="kpi-value">${Utils.formatCurrency(metrics.forecast)}</span>
            </div>
        `;
    },

    renderRevenueChart(history) {
        const ctx = document.getElementById('exec-revenue-chart');
        if (!ctx) return;

        // Aggregate daily history to monthly for the chart if needed, 
        // but let's assume history is daily snapshots for last 6 months.
        // Simplified: Just showing daily/monthly trend line.

        const labels = history.map(h => h.snapshot_date);
        const values = history.map(h => h.won_amount);

        if (this.revenueChart) this.revenueChart.destroy();

        this.revenueChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Receita',
                    data: values,
                    borderColor: '#58a6ff',
                    backgroundColor: 'rgba(88, 166, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { grid: { color: 'rgba(255,255,255,0.05)' } }
                }
            }
        });
    },

    renderUnitChart(data) {
        const ctx = document.getElementById('exec-unit-chart');
        if (!ctx || !data) return;

        const labels = Object.keys(data);
        const values = Object.values(data);

        if (this.unitChart) this.unitChart.destroy();

        this.unitChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: ['#1f6feb', '#238636', '#d29922', '#a371f7'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', labels: { color: '#8b949e' } }
                }
            }
        });
    }
};
