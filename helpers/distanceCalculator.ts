import haversine from "haversine";

export const calculateTotalDistance = (
    currentMovementTrails: { latitude: number; longitude: number }[]
) => {
    let total = 0;
    for (let i = 1; i < currentMovementTrails.length; i++) {
        const start = currentMovementTrails[i - 1];
        const end = currentMovementTrails[i];
        const distance = haversine(start, end);
        total += distance;
    }
    return total;
};
