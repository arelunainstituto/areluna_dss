
import { AlertChecker } from '../processors/alertChecker';
import { ENV } from '../config/env';

(async () => {
    console.log('Starting Manual Alert Check...');
    const start = Date.now();
    try {
        await AlertChecker.runChecks();
        console.log(`Alert Check Completed in ${(Date.now() - start) / 1000}s`);
        process.exit(0);
    } catch (error) {
        console.error('Alert Check Failed:', error);
        process.exit(1);
    }
})();
