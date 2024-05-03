export function chunk<T>(input: T[], size = 5) {
    const result = [];
    for (let i = 0; i < input.length; i += size) {
        result.push(input.slice(i, i + size));
    }
    return result;
}