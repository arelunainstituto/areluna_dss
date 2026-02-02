export const MathUtils = {
    /**
     * Calculates linear regression (y = mx + b)
     * returns { slope, intercept, r2 }
     */
    linearRegression(data: { x: number; y: number }[]) {
        const n = data.length;
        if (n === 0) return { slope: 0, intercept: 0, r2: 0 };

        let sumX = 0;
        let sumY = 0;
        let sumXY = 0;
        let sumXX = 0;
        let sumYY = 0;

        for (let i = 0; i < n; i++) {
            const { x, y } = data[i];
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumXX += x * x;
            sumYY += y * y;
        }

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // R2 calc
        const ssTot = sumYY - (sumY * sumY) / n;
        const ssRes = sumYY - intercept * sumY - slope * sumXY;
        const r2 = 1 - ssRes / ssTot;

        return { slope: isNaN(slope) ? 0 : slope, intercept: isNaN(intercept) ? 0 : intercept, r2: isNaN(r2) ? 0 : r2 };
    },

    standardDeviation(values: number[]) {
        const n = values.length;
        if (n === 0) return 0;
        const mean = values.reduce((a, b) => a + b, 0) / n;
        return Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / n);
    },

    mode(values: number[]) {
        if (values.length === 0) return null;
        const modeMap: Record<number, number> = {};
        let maxEl = values[0], maxCount = 1;
        for (const val of values) {
            if (!modeMap[val]) modeMap[val] = 1;
            else modeMap[val]++;
            if (modeMap[val] > maxCount) {
                maxEl = val;
                maxCount = modeMap[val];
            }
        }
        return maxEl;
    },

    median(values: number[]) {
        if (values.length === 0) return 0;
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    }
};
