import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'percentage'
})

export class PercentagePipe implements PipeTransform {
    transform(value: number, max: number): string {
        if (!max) {
            return '';
        }
        const percentage = Math.round((value / max) * 100);
        return percentage + '%';
    }
}
