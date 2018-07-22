import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'secToWords'
})

export class SecToWordsPipe implements PipeTransform {
    transform(s: number): string {

        if (typeof s !== 'number') { return ''; }

        let year = 0;
        let month = 0;
        let week = 0;
        let day = 0;
        let hod = 0;
        let min = 0;

        let text = '';

        if (s >= 31536000) {
            year = Math.floor(s / 31536000);
            s -= (year * 31536000);

            text += year > 0 ? year + ' ' : '';
            if (year === 1) {
                text += 'rok';
            } else if (year > 1 && year < 5) {
                text += 'roky';
            } else if (year > 4) {
                text += 'roků';
            }
        }

        if (s >= 2592000) {
            month = Math.floor(s / 2592000);
            s -= (month * 2592000);

            text += month > 0 ? ' ' + month + ' ' : '';
            if (month === 1) {
                text += 'měsíc';
            } else if (month > 1 && month < 5) {
                text += 'měsíce';
            } else if (month > 4) {
                text += 'měsíců';
            }
        }

        if (s >= 604800) {
            week = Math.floor(s / 604800);
            s -= (week * 604800);

            text += week > 0 ? ' ' + week + ' ' : '';
            if (week === 1) {
                text += 'týden';
            } else if (week > 1 && week < 5) {
                text += 'týdny';
            } else if (week > 4) {
                text += 'týdnů';
            }
        }

        if (s >= 86400) {
            day = Math.floor(s / 86400);
            s -= (day * 86400);

            text += day > 0 ? ' ' + day + ' ' : '';
            if (day === 1) {
                text += 'den';
            } else if (day > 1 && day < 5) {
                text += 'dny';
            } else if (day > 4) {
                text += 'dnů';
            }
        }

        if (s >= 3600) {
            hod = Math.floor(s / 3600);
            s -= (hod * 3600);

            text += hod > 0 ? ' ' + hod + ' ' : '';
            if (hod === 1) {
                text += 'hodinu';
            } else if (hod > 1 && hod < 5) {
                text += 'hodiny';
            } else if (hod > 4) {
                text += 'hodin';
            }
        }
        if (s >= 60) {
            min = Math.floor(s / 60);
            s -= min * 60;

            text += min > 0 ? ' ' + min + ' ' : '';
            if (min === 1) {
                text += 'minutu';
            } else if (min > 1 && min < 5) {
                text += 'minuty';
            } else if (min > 4) {
                text += 'minut';
            }
        }
        return text;
        // (
        //     (year > 0 ? ' ' + year + ' roků ' : '') +
        //     (month > 0 ? ' ' + month + ' měsíců' : '') +
        //     (week > 0 ? ' ' + week + ' týdnů' : '') +
        //     (day > 0 ? ' ' + day + ' dní' : '') +
        //     (hod > 0 ? ' ' + hod + ' hodin' : '') +
        //     (min > 0 ? ' ' + min + ' minut' : '')
        // );
    }
}
