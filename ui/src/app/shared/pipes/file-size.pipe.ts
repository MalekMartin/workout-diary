import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {
    transform(value: number): string {
        let pom;
        let units = 'B';
        if (value > 1024) {
            pom = value / 1024;
            units = 'kB';
        }
        if (pom > 1024) {
            pom = pom / 1024;
            units = 'MB';
        }
        if (pom > 1024) {
            pom = pom / 1024;
            units = 'GB';
        }
        return pom.toFixed(2) + units;
    }
}
