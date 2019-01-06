import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'secToTime'
})
export class SecToTimePipe implements PipeTransform {
    transform(s: number): string {
        if (typeof s !== 'number') {
            return '--:--';
        }

        let hod = 0;
        let min = 0;
        let sec = 0;

        if (s >= 3600) {
            hod = Math.floor(s / 3600);
            s -= hod * 3600;
        }
        if (s >= 60) {
            min = Math.floor(s / 60);
            s -= min * 60;
        }
        sec = s;
        return (
            (hod < 10 ? '0' + hod : hod) +
            ':' +
            (min < 10 ? '0' + min : min) +
            ':' +
            (sec < 10 ? '0' + sec : sec)
        );

        // const hou = Math.floor(value / 3600);
        // const minPom = hou > 0 ? value - (3600 * hou) : 0;
        // // const min = Math.floor((minPom || value) / 60);
        // const min = minPom > 0
        //     ? Math.floor((minPom) / 60)
        //     : value <= 3600
        //         ? Math.floor(value / 60)
        //         : 0;
        // const sec = ((minPom || value) % 60);

        // const time = (min > 9 ? min : '0' + min) + ':' + (sec > 9 ? sec : '0' + sec);
        // const hour = hou > 9 ? hou : '0' + hou;
        // return hou > 0 ? hour + ':' + time : time;
    }
}
