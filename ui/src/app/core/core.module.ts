import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { SpinningWorkoutService } from './spinning-workout/spinning-workout.service';
import { HttpService } from './http.service';
import { GpxService } from './gpx/gpx.service';

@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [],
})
export class CoreModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: [
                SpinningWorkoutService,
                HttpService,
                GpxService
            ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}

