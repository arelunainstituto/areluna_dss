const OperationalCharts = {
    doctorSalesChart: null,
    doctorCountChart: null,
    leadsChart: null,

    render(data) {
        this.updateKPIs(data.primary);
        this.renderDoctorSalesChart(data.primary.salesByOwner);
        this.renderDoctorCountChart(data.primary.countByOwner);
        this.renderLeadsChart(data.primary.leadsByOwner);
    },

    updateKPIs(metrics) {
        const container = document.getElementById('operational-kpis');
        if (!container || !metrics) return;
        // Ops might not have specific KPIs in O1-O4 that are scalar, mostly breakdowns.
        // We can show top doctor or total sales.

        let topOwner = '-';
        let maxSales = 0;
        if (metrics.salesByOwner) {
            Object.entries(metrics.salesByOwner).forEach(([owner, val]) => {
                if (Number(val) > maxSales) { maxSales = Number(val); topOwner = owner; }
            });
        }

        container.innerHTML = `
            <div class="kpi-card">
                <span class="kpi-title">Top Gestor (Vendas)</span>
                <span class="kpi-value" style="font-size: 1.5rem">${topOwner}</span>
                <span class="kpi-trend positive">${Utils.formatCurrency(maxSales)}</span>
            </div>
        `;
    },

    renderDoctorSalesChart(data) {
        const ctx = document.getElementById('ops-doctor-sales-chart');
        if (!ctx || !data) return;

        const labels = Object.keys(data);
        const values = Object.values(data);

        if (this.doctorSalesChart) this.doctorSalesChart.destroy();

        this.doctorSalesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Vendas (€)',
                    data: values,
                    backgroundColor: '#a371f7',
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
    },

    renderDoctorCountChart(data) {
        const ctx = document.getElementById('ops-doctor-count-chart');
        if (!ctx || !data) return;

        const labels = Object.keys(data);
        const values = Object.values(data);

        if (this.doctorCountChart) this.doctorCountChart.destroy();

        this.doctorCountChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Procedimentos',
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

    renderLeadsChart(data) {
        const ctx = document.getElementById('ops-leads-chart');
        if (!ctx || !data) return;

        const labels = Object.keys(data);
        const values = Object.values(data);

        if (this.leadsChart) this.leadsChart.destroy();

        this.leadsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Contagem de Registro',
                    data: values,
                    backgroundColor: '#2d9cdb',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return 'Leads: ' + context.parsed.y;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { precision: 0 }
                    },
                    x: {
                        grid: { display: false },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 0
                        }
                    }
                }
            }
        });
    }
};
