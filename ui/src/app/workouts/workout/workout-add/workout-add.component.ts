import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { WorkoutService } from '../../../core/workout/workout.service';
import { FileUploader, FileUploaderOptions, FileItem } from 'ng2-file-upload';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { WorkoutFormComponent } from '../workout-form/workout-form.component';

@Component({
    selector: 'wd-workout-add',
    templateUrl: 'workout-add.component.html',
    styleUrls: ['./workout-add.component.scss']
})

export class WorkoutAddComponent implements OnInit {

    @ViewChild(WorkoutFormComponent) formRef: WorkoutFormComponent;

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
        private _router: Router,
        private _dialogRef: MatDialogRef<WorkoutAddComponent>,
        private _snackBar: MatSnackBar
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
            this._dialogRef.close();
            this._router.navigate(['workouts', this._workoutId]);
        };

        this.uploader.onErrorItem = (item: FileItem, response: any) => {
            this._dialogRef.close();
            this._snackBar.open('Soubor ' + item.file.name + ' se nepodařilo nahrát', 'Zavřít', {
                duration: 3000,
            });
            this._router.navigate(['workouts', this._workoutId]);
        };
    }

    save() {

        this._workout.addWorkout(this.formRef.form.value)
            .subscribe((id: string) => {
                this._workoutId = id;

                if (this.uploader.queue.length > 0) {
                    this.uploader.setOptions({
                        url: '/resource/workout/' + this._workoutId + '/file'}
                    );
                    this.uploader.uploadAll();
                } else {
                    this._dialogRef.close();
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
