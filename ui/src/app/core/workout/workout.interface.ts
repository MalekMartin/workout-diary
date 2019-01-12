import { Gear } from '../gear/gear.interface';

export interface Workout {
    activity: Activity;
    avgHr: number;
    avgSpeed: number;
    avgCadence: number;
    distance: number;
    duration: number;
    energy: number;
    maxHr: number;
    maxSpeed: number;
    maxCadence: number;
    maxEle: number;
    minEle: number;
    eleUp: number;
    eleDown: number;
    note: string;
    id: string;
    date: string;
    time: string;
    log: WorkoutLogFile;
    name: string;
    gear: Gear;
}

export interface WorkoutWoActivity {
    activity: string;
    avgHr: number;
    avgSpeed: number;
    avgCadence: number;
    distance: number;
    duration: number;
    energy: number;
    maxHr: number;
    maxSpeed: number;
    maxCadence: number;
    note: string;
    id: string;
    date: string;
    time: string;
    log: WorkoutLogFile;
    name: string;
    gear: Gear;
}

export interface Activity {
    id: string;
    name: string;
    icon: string;
    color: string;
    hr?: boolean;
    speed?: boolean;
    elevation?: boolean;
    cadence?: boolean;
}

export interface WorkoutLogFile {
    id: string;
    name: string;
    type: string;
    size: string;
}

export declare enum WorkoutType {
    HR = 'HR', SPEED = 'SPEED', CAD = 'CAD', ELE = 'ELE'
}

export interface Coordinate {
    lat: number;
    lon: number;
}

export interface TrackPoints {
    center: Coordinate;
    coordinates: TrackPoint[];
    count: number;
    distance: Coordinate;
}

export interface TrackPoint {
    active: boolean;
    series: number[][];
}
