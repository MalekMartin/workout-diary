import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { TrackPoints, TrackPoint } from '../../../core/workout/workout.interface';
import * as _ from 'lodash';

@Component({
    selector: 'wd-smap',
    templateUrl: 'smap.component.html',
    styleUrls: ['./smap.component.scss']
})
export class SMapComponent implements OnInit, OnDestroy {
    @Input()
    set route(r: TrackPoints) {
        if (!!r) {
            if (!this._route) {
                this._route = r;
            } else {
                this._route = r;
                this.drawRoute(this.routeLayer, this._route.coordinates, this.options);
            }
        }
    }

    options = { color: 'red', width: 3 };

    mapa;
    routeLayer;

    private _route: TrackPoints;
    private _onLoaderLoaded$ = new Subject();
    private _onDestroy$ = new Subject();

    constructor(private _cd: ChangeDetectorRef) {}

    ngOnInit() {
        this.prepareLoader();
    }

    ngOnDestroy() {
        this._onDestroy$.next();
    }

    prepareLoader() {
        try {
            Loader.async = true;
            Loader.load(null, null, this.loadMap);
        } catch (e) {
            setTimeout(() => {
                this.prepareLoader();
            }, 100);
        }
    }

    loadMap = () => {
        const stred = SMap.Coords.fromWGS84(this._route.center.lon, this._route.center.lat);
        this.mapa = new SMap(JAK.gel('mapa'), stred, 12);
        // Pridani vrstev s ruznyma mapovyma podkladama
        const layers = {};
        layers[SMap.DEF_BASE] = this.mapa.addDefaultLayer(SMap.DEF_BASE);
        layers[SMap.DEF_OPHOTO] = this.mapa.addDefaultLayer(SMap.DEF_OPHOTO);
        // layers[SMap.DEF_HYBRID] = mapa.addDefaultLayer(SMap.DEF_HYBRID);
        layers[SMap.DEF_TURIST] = this.mapa.addDefaultLayer(SMap.DEF_TURIST);
        layers[SMap.DEF_BASE].enable();
        // mapa.addLayer(SMap.DEF_OPHOTO);

        // pridani vychozich ovladacich prvku
        this.mapa.addDefaultControls();

        // Pridani tlacitka pro vyber mapy
        const c = new SMap.Control.Layer();
        c.addDefaultLayer(SMap.DEF_BASE);
        c.addLayer(SMap.DEF_OPHOTO, 'Satelitní', '', 'Satelitní');
        // c.addLayer(SMap.DEF_HYBRID, 'Hybridní', '', 'Hybridní');
        c.addLayer(SMap.DEF_TURIST, 'Turistická', '', 'Turistická');
        this.mapa.addControl(c, { left: '8px', top: '9px' });

        this.routeLayer = new SMap.Layer.Geometry();
        this.mapa.addLayer(this.routeLayer);
        this.routeLayer.enable();

        this.drawRoute(this.routeLayer, this._route.coordinates, this.options);
    }

    drawRoute(layer: any, data: TrackPoint[], options: { color: string; width: number }) {
        layer.removeAll();
        const points = _.flatten(this._prepareData(data));
        const polyline = new SMap.Geometry(SMap.GEOMETRY_POLYLINE, null, points, options);
        layer.addGeometry(polyline);
        layer.redraw();
        this.mapa.setCenter(SMap.Coords.fromWGS84(this._route.center.lon, this._route.center.lat), true);

    }

    private _prepareData(data: TrackPoint[]) {
        return data.map(d => {
            return d.series.map(s => {
                return SMap.Coords.fromWGS84(s[0], s[1]);
            });
        });
    }
}
