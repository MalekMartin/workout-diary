export class HrZones {
    zones = [
        {
            id: '1',
            name: 'Zóna 1',
            description: '90 - 120',
        },
        {
            id: '2',
            name: 'Zóna 2',
            description: '120 - 140',
        },
        {
            id: '3',
            name: 'Zóna 3',
            description: '140 - 160',
        },
        {
            id: '4',
            name: 'Zóna 4',
            description: '160 - 180',
        },
        {
            id: '5',
            name: 'Zóna 5',
            description: '180 - 190',
        }
    ];
}

export interface HrZone {
    id: string;
    name: string;
    description: string;
}
