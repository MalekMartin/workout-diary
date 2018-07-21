import { NgModule } from '@angular/core';
import { SecToTimePipe } from './sec-to-time.pipe';
import { MomentPipe } from './moment.pipe';
import { FileSizePipe } from './file-size.pipe';

const PIPES = [
    SecToTimePipe,
    MomentPipe,
    FileSizePipe,
];

@NgModule({
    imports: [],
    exports: [...PIPES],
    declarations: [...PIPES],
    providers: [],
})
export class PipesModule { }
