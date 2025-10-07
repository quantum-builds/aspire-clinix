export function calcChange(current: number, prev: number) {
    if (prev === 0) return current > 0 ? 100 : 0;
    return ((current - prev) / prev) * 100;
};