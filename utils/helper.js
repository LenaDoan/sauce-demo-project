//Sort string for ascending order
export function sortAToZString(array) {
    return [...array].sort((a, b) => a.localeCompare(b));
}

//Sort string for descending order
export function sortZToAString(array) {
    return [...array].sort((a, b) => b.localeCompare(a));
}

//Sort number for ascending order
export function sortAToZNumber(array) {
    return [...array].sort((a,b)=>a-b);
}

//Sort number for descending order
export function sortZToANumber(array) {
    return [...array].sort((a,b)=>b-a);
}