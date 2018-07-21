import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkoutService } from '../../../core/workout/workout.service';
import { FileUploader, FileUploaderOptions, FileItem } from 'ng2-file-upload';

@Component({
    selector: 'wd-workout-add',
    templateUrl: 'workout-add.component.html',
    styleUrls: ['./workout-add.component.scss']
})

export class WorkoutAddComponent implements OnInit {

    isUploading = false;
    hasBaseDropZoneOver = false;

    private _workoutId: string;

    private _maxFileSize = 6000000;

    private _options: FileUploaderOptions = {
        maxFileSize: this._maxFileSize,
        method: 'post',
        removeAfterUpload: true,
        // url: '/resource/workout/' + id + '/file',
        autoUpload: false,
        queueLimit: 1
    };

    uploader = new FileUploader(this._options);

    constructor(
        private _workout: WorkoutService,
        private _router: Router
    ) { }

    ngOnInit() {
        this.uploader.onWhenAddingFileFailed = (item, filter, options) => {
            this.isUploading = false;
            if (filter.name === 'fileSize') {
                console.log('Překročil jsi povolenou maximální velikost souboru ('
                    + (this._maxFileSize / (1024 * 1024)).toFixed(2)
                    + 'MB).', 'Soubor je příliš velký!');
            }
        };

        this.uploader.onBeforeUploadItem = (fileitem: FileItem) => {
            this.isUploading = true;
        };

        this.uploader.onSuccessItem = (item: FileItem, response: any) => {
            this._router.navigate(['workouts', this._workoutId]);
        };
    }

    save(value) {

        this._workout.addWorkout(value)
            .subscribe((id: string) => {
                this._workoutId = id;

                if (this.uploader.queue.length > 0) {
                    this.uploader.setOptions({
                        url: '/resource/workout/' + this._workoutId + '/file'}
                    );
                    this.uploader.uploadAll();
                } else {
                    this._router.navigate(['workouts', this._workoutId]);
                }
            }, this._onSaveError);
    }

    fileOverBase(status) {
        this.hasBaseDropZoneOver = status;
    }

    private _onSaveError = () => {
        console.log('Workout was not created.');
    }
}
