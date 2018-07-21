export interface SpinningWorkout {
    id: string;
    name: string;
    sections: SpinningSection[];
}

declare type SectionType = 'WARM_UP' | 'WORK' | 'REST' | 'COOL_DOWN';

export interface SpinningSection {
    id: string;
    order?: number;
    type: SectionType;
    rpm: number;
    zone: '1' | '2' | '3' | '4' | '5';
    duration: number;
}
