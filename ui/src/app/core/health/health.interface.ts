export interface Illness {
    id?: string;
    date: string;
    type: string;
    time: string;
    note: string;
    course: string;
}

export interface IllnessWithType {
    id?: string;
    date: string;
    type: {id: string, name: string};
    time: string;
    note: string;
    course: string;
}
