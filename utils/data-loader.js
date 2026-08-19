import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

//Use for data test has the same name structure, like login-input.json and inventory-input.json
export function loadTestData(fileName) {
    try {
        const filePath = join(process.cwd(), 'resources', 'data-test', `${fileName}-input.json`)
        const data = readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error loading test data file: ${fileName}`, error);
        return {};
    }
}

// Specific data loaders
export function getLoginData() {
    return loadTestData('login-data');
}

export function getInventoryData() {
    return loadTestData('inventory-data');
}