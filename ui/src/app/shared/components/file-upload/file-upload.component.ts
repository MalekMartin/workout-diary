import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileUploader, FileItem } from 'ng2-file-upload';

@Component({
    selector: 'wd-file-upload',
    templateUrl: 'file-upload.component.html',
    styleUrls: ['./file-upload.component.scss']
})

export class FileUploadComponent implements OnInit {

    @Input() maxFileSize = 6000000;
    @Input() url: string;
    @Output() uploaded = new EventEmitter();

    isUploading = false;
    hasBaseDropZoneOver = false;

    _options = {
        maxFileSize: this.maxFileSize,
        method: 'post',
        removeAfterUpload: true,
        url: '',
        autoUpload: true,
        // headers: [{name: 'Authorization', value: 'Bearer ' + this._auth.accessToken}]
    };

    uploader: FileUploader;

    constructor() {
    }

    ngOnInit() {
        this._options.maxFileSize = this.maxFileSize;
        this._options.url = this.url;

        this.uploader = new FileUploader(this._options);

        this.uploader.onWhenAddingFileFailed = (item, filter, options) => {
            this.isUploading = false;
            if (filter.name === 'fileSize') {
                console.log('Překročil jsi povolenou maximální velikost souboru ('
                    + (this.maxFileSize / (1024 * 1024)).toFixed(2)
                    + 'MB).', 'Soubor je příliš velký!');
            }
        };

        this.uploader.onBeforeUploadItem = (fileitem: FileItem) => {
            this.isUploading = true;
            // this.uploader.options.headers[0] = {
            //     name: 'Authorization',
            //     value: 'Bearer ' + this._auth.accessToken
            // };
        };

        this.uploader.onSuccessItem = (item: FileItem, response: any) => {
            const file = JSON.parse(response);
            this.uploaded.emit(file);
        };
    }

    fileOverBase(status) {
        this.hasBaseDropZoneOver = status;
    }
}
