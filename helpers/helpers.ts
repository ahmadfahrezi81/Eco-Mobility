import { Coordinate } from "../types";

export const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getTimeDifference = (start: Date, end: Date) => {
    const diffInMs = Math.abs(end.getTime() - start.getTime());
    const diffInHours = Math.floor(diffInMs / 1000 / 60 / 60);
    const diffInMinutes = Math.floor((diffInMs / 1000 / 60) % 60);
    const diffInSeconds = Math.floor((diffInMs / 1000) % 60);

    // Adding leading zero if less than 10
    const format = (num: number) => `0${num}`.slice(-2);

    return `${diffInHours}:${format(diffInMinutes)}:${format(diffInSeconds)}`;
};

export const getMapRegion = (coordinates: Coordinate[]) => {
    if (coordinates.length === 0) {
        return {
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        };
    }

    const minLat = Math.min(...coordinates.map((coord) => coord.latitude));
    const maxLat = Math.max(...coordinates.map((coord) => coord.latitude));
    const minLng = Math.min(...coordinates.map((coord) => coord.longitude));
    const maxLng = Math.max(...coordinates.map((coord) => coord.longitude));

    const latitudeDelta = maxLat - minLat;
    const longitudeDelta = maxLng - minLng + 0.002;

    return {
        latitude: (maxLat + minLat) / 2,
        longitude: (maxLng + minLng) / 2,
        latitudeDelta,
        longitudeDelta,
    };
};

export const getCO2EmissionRate = (input: string) => {
    let emission = null;

    switch (input.toUpperCase()) {
        case "CAR":
            emission = 0.56;
            break;
        case "MOTORCYCLE":
            emission = 0.3;
            break;
        case "BUS":
            emission = 0.25;
            break;
        case "WALKING":
            emission = 0;
            break;
        default:
            break;
    }

    return emission;
};
