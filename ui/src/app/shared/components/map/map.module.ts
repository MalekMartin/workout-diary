import { NgModule } from '@angular/core';
import {AngularOpenlayersModule} from 'ngx-openlayers';
import { MapComponent } from './map.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
        AngularOpenlayersModule,
    ],
    exports: [MapComponent],
    declarations: [MapComponent],
    providers: [],
})
export class MapModule { }
