import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { FileUploader, FileItem, FileUploaderOptions } from 'ng2-file-upload';
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

    form = this._fb.group({
        ele: ['320.0'],
        lat: ['48.946966'],
        lon: ['17.662286'],
        options: ['REMOVE_EMPTY']
    });

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

    uploader = new FileUploader(this._options);

    constructor(private _fb: FormBuilder, private _http: HttpService) {
        this.uploader.onWhenAddingFileFailed = (item, filter, options) => {
            this.isUploading = false;
            if (filter.name === 'fileSize') {
                console.log(
                    'Překročil jsi povolenou maximální velikost souboru (' + (this._maxFileSize / (1024 * 1024)).toFixed(2) + 'MB).',
                    'Soubor je příliš velký!'
                );
            }
        };

        this.uploader.onBeforeUploadItem = (fileitem: FileItem) => {
            this.isUploading = true;

            if (this.form.get('options').value === 'USE_DEFAULT') {
                this.uploader.options.additionalParameter = {
                    lat: this.form.get('lat').value,
                    lon: this.form.get('lon').value,
                    ele: this.form.get('ele').value
                };
            }
        };

        this.uploader.onSuccessItem = (item: FileItem, response: any) => {
            const file = JSON.parse(response);
            this.getExportedFile(file, item.file.name);
        };
    }

    ngOnInit() {}

    getExportedFile(id: string, name: string) {
        this.downoading = true;
        this._http.saveFileAs('/resource/csv-to-gpx/gpx?id=' + id).subscribe(
            blob => {
                const file = new Blob([blob]);
                FileSaver.saveAs(file, name.replace('.csv', '.gpx'));
                this.downoading = false;
            },
            () => {
                console.warn('Nepodařilo se stáhnout soubor!');
                this.downoading = false;
            }
        );
    }

    fileOverBase(status) {
        this.hasBaseDropZoneOver = status;
    }
}
