const Alerts = {
    init() {
        this.checkAlerts();
        setInterval(() => this.checkAlerts(), 60000); // Check every minute
    },

    async checkAlerts() {
        try {
            const response = await fetch('/api/alerts/active');
            const alerts = await response.json();

            const alertBar = document.getElementById('alert-bar');
            const alertMessage = document.getElementById('alert-message');

            if (alerts && alerts.length > 0) {
                const latest = alerts[0];
                alertMessage.textContent = `ALERT: ${latest.record_name} (${latest.alert_type})`;
                alertBar.classList.remove('hidden');
                alertBar.classList.add('active'); // Add pulse animation if defined
            } else {
                alertBar.classList.add('hidden');
            }
        } catch (error) {
            console.error('Failed to check alerts:', error);
        }
    }
};
