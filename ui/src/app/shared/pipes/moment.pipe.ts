import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'moment'
})

export class MomentPipe implements PipeTransform {
    transform(value: string, format: string = 'DD.MM.YYYY'): string {
        if (!value) { return ''; }

        const date = moment(value, moment.ISO_8601);
        if (date.isValid()) {
            return date.format(format);
        } else {
            return value;
        }
    }
}
