import { Timestamp } from "firebase/firestore";

export interface Coordinate {
    latitude: number;
    longitude: number;
}

export interface MovementTrail {
    id: string;
    coordinates: Coordinate[];
    distance: number;
    startTime: Timestamp;
    endTime: Timestamp;
    vehicle: string;
}

export interface TrackingActivity {
    id: string;
    coordinates: Coordinate[];
    distance: number;
    startTime: Timestamp;
    endTime: Timestamp;
    vehicle: string;
    xp?: number;
}

export interface Leaderboard {
    userId: string;
    name: string;
    xp: number;
    ranking: number;
}

export interface MovementTrailWithoutID {
    coordinates: Coordinate[];
    distance: number;
    startTime: Timestamp;
    endTime: Timestamp;
    vehicle: string;
}
