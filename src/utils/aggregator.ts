
/**
 * Groups an array of objects by a specific key and counts occurrences.
 * @param data - Array of objects to group
 * @param key - Key to group by
 * @param transform - Optional function to transform the value before grouping
 */
export function countBy(
    data: any[],
    key: string,
    transform?: (value: any) => any
): Record<string, number> {
    return data.reduce((acc, item) => {
        let value = item[key] ?? 'Unknown';
        // If it's a Zoho lookup object (e.g. Owner: {name: "...", id: "..."}), use the name
        const label = typeof value === 'object' && value !== null && value.name
            ? value.name
            : String(value);

        // Apply transformation if provided
        const finalLabel = transform ? transform(label) : label;

        acc[finalLabel] = (acc[finalLabel] || 0) + 1;
        return acc;
    }, {});
}

/**
 * Groups an array of objects by a specific key and sums a numeric field.
 */
export function sumByGroup(data: any[], groupKey: string, sumKey: string): Record<string, number> {
    return data.reduce((acc, item) => {
        const groupValue = item[groupKey] ?? 'Unknown';
        const label = typeof groupValue === 'object' && groupValue !== null && groupValue.name
            ? groupValue.name
            : String(groupValue);

        const valueToSum = parseFloat(item[sumKey] || 0);
        acc[label] = (acc[label] || 0) + valueToSum;
        return acc;
    }, {});
}

/**
 * Sums a specific field across all items.
 */
export function sum(data: any[], key: string): number {
    return data.reduce((acc, item) => acc + parseFloat(item[key] || 0), 0);
}

/**
 * Calculates the average of a specific field.
 */
export function average(data: any[], key: string): number {
    if (data.length === 0) return 0;
    return sum(data, key) / data.length;
}
