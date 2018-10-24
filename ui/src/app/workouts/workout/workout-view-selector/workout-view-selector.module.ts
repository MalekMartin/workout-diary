import { NgModule } from '@angular/core';
import { WorkoutViewSelectorComponent } from './workout-view-selector.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [ReactiveFormsModule],
    exports: [WorkoutViewSelectorComponent],
    declarations: [WorkoutViewSelectorComponent],
    providers: [],
})
export class WorkoutViewSelectorModule { }

