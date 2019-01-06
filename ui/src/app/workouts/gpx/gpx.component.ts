import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { FileItem, FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GpxCoordinates, GpxService } from '../../core/gpx/gpx.service';
import { HttpService } from '../../core/http.service';

declare var require: any;
const FileSaver = require('file-saver');

@Component({
    selector: 'wd-gpx',
    templateUrl: 'gpx.component.html',
    styleUrls: ['./gpx.component.scss']
})
export class GpxComponent implements OnInit {
    raw = new FormControl('');
    hrData: { time: string; value: number }[];
    downoading = false;
    hasBaseDropZoneOver = false;
    coordinates: GpxCoordinates[] = [];
    showForm = false;

    form = this._fb.group({
        coordinates: [null],
        options: ['REMOVE_EMPTY']
    });

    coordinate = new FormControl('');

    stats = [];

    isUploading = false;

    private _maxFileSize = 6000000;
    private _options: FileUploaderOptions = {
        maxFileSize: this._maxFileSize,
        method: 'post',
        removeAfterUpload: true,
        url: '/resource/csv-to-gpx',
        autoUpload: false,
        queueLimit: 1
    };

    private _onDestroy$ = new Subject();

    uploader = new FileUploader(this._options);

    constructor(private _fb: FormBuilder, private _http: HttpService, private _gpxService: GpxService) {
        this.uploader.onWhenAddingFileFailed = (item, filter, options) => {
            this.isUploading = false;
            if (filter.name === 'fileSize') {
                console.log(
                    'Překročil jsi povolenou maximální velikost souboru (' +
                        (this._maxFileSize / (1024 * 1024)).toFixed(2) +
                        'MB).',
                    'Soubor je příliš velký!'
                );
            }
        };

        this.uploader.onBeforeUploadItem = (fileitem: FileItem) => {
            this.isUploading = true;

            if (this.form.get('options').value === 'USE_DEFAULT') {
                const coor = this.getCoordinatesById(this.form.get('coordinates').value);
                this.uploader.options.additionalParameter = {
                    lat: coor.lat,
                    lon: coor.lon,
                    ele: coor.ele
                };
                // this.uploader.options.additionalParameter = {
                //     lat: this.form.get('lat').value,
                //     lon: this.form.get('lon').value,
                //     ele: this.form.get('ele').value
                // };
            }
        };

        this.uploader.onSuccessItem = (item: FileItem, response: any) => {
            const file = JSON.parse(response);
            this.getExportedFile(file, item.file.name);
        };
    }

    ngOnInit() {
        this.getCoordinates();
    }

    getExportedFile(id: string, name: string) {
        this.downoading = true;
        this._http.saveFileAs('/resource/csv-to-gpx/gpx?id=' + id).subscribe(
            blob => {
                const file = new Blob([blob]);
                FileSaver.saveAs(file, name.replace('.csv', '.gpx'));
                this.downoading = false;
            },
            e => {
                console.log(e);
                console.warn('Nepodařilo se stáhnout soubor!');
                this.downoading = false;
            }
        );
    }

    getCoordinatesById(id: string) {
        return this.coordinates.find(c => id === c.id);
    }

    fileOverBase(status) {
        this.hasBaseDropZoneOver = status;
    }

    getCoordinates() {
        this._gpxService
            .findCoordinates()
            .pipe(takeUntil(this._onDestroy$))
            .subscribe((c: GpxCoordinates[]) => {
                this.coordinates = c;
            });
    }

    saveCoordinates(coordinates: GpxCoordinates) {
        this._gpxService
            .saveCoordinates(coordinates)
            .pipe(takeUntil(this._onDestroy$))
            .subscribe(() => {
                this.getCoordinates();
            });
    }

    toggleForm() {
        this.showForm = !this.showForm;
    }
}
