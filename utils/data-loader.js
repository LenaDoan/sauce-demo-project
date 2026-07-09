import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Load test data from JSON file
export function loadTestData(fileName) {
    try {
        const candidates = [
            join(process.cwd(), 'resources', 'data-test', `${fileName}.json`),
            join(process.cwd(), 'resources', 'data-test', `${fileName}-input.json`)
        ];

        const filePath = candidates.find((candidate) => existsSync(candidate));

        if (!filePath) {
            throw new Error(`Test data file not found for ${fileName}`);
        }

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


// Example usage:
// import { getLoginData } from '../helpers/dataLoader.js';
// const loginData = getLoginData();
// const users = loginData.users;
