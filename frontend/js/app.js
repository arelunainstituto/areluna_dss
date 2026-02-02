const App = {
    currentTab: 'executive',
    refreshInterval: null,

    init() {
        this.setupNavigation();
        Alerts.init();
        this.loadDashboard(this.currentTab);

        // Poll every 5 minutes
        this.refreshInterval = setInterval(() => {
            this.loadDashboard(this.currentTab);
        }, 5 * 60 * 1000);
    },

    setupNavigation() {
        const buttons = document.querySelectorAll('.nav-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update tab state
                this.currentTab = btn.dataset.tab;

                // Show relevant view
                document.querySelectorAll('.dashboard-view').forEach(view => {
                    view.classList.remove('active');
                });
                document.getElementById(`${this.currentTab}-view`).classList.add('active');

                // Load data
                this.loadDashboard(this.currentTab);
            });
        });
    },

    async loadDashboard(type) {
        this.updateStatus('Loading...', false);
        try {
            const response = await fetch(`/api/dashboard/${type}`);
            const data = await response.json();

            switch (type) {
                case 'executive':
                    ExecutiveCharts.render(data);
                    break;
                case 'commercial':
                    CommercialCharts.render(data);
                    break;
                case 'marketing':
                    MarketingCharts.render(data);
                    break;
                case 'operational':
                    OperationalCharts.render(data);
                    break;
            }
            this.updateStatus(new Date().toLocaleTimeString(), true);
        } catch (error) {
            console.error(`Failed to load ${type} dashboard:`, error);
            this.updateStatus('Error', false);
        }
    },

    updateStatus(text, live) {
        const statusEl = document.getElementById('last-update');
        const dotEl = document.querySelector('.status-indicator .dot');
        if (statusEl) statusEl.textContent = text;
        if (dotEl) {
            if (live) dotEl.classList.add('live');
            else dotEl.classList.remove('live');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
