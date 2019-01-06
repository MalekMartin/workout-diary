export interface HeartRateBase {
    id?: string;
    activity: string;
    date: string;
    bpm: number;
    note: string;
}

export interface HeartRate {
    id?: string;
    activity: HeartRateActivity;
    date: string;
    bpm: number;
    note: string;
}

export interface HeartRateActivity {
    id: string;
    name: string;
}
