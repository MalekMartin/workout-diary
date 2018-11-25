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
                this._drawRoute(this._route.coordinates, this.options);
            }
        }
    }

    options = { color: 'red', width: 3 };

    mapa;
    routeLayer;

    expanded = false;

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
        /**
         * Pokud chci pouzit prepinac vrstev, pridam do mapy mapove podklady ktere chci
         */
        const layers = {};
        layers[SMap.DEF_BASE] = this.mapa.addDefaultLayer(SMap.DEF_BASE);
        layers[SMap.DEF_OPHOTO] = this.mapa.addDefaultLayer(SMap.DEF_OPHOTO);
        // layers[SMap.DEF_HYBRID] = mapa.addDefaultLayer(SMap.DEF_HYBRID);
        layers[SMap.DEF_TURIST] = this.mapa.addDefaultLayer(SMap.DEF_TURIST);
        layers[SMap.DEF_BASE].enable();

        /**
         * Pokud nepotrebuju prepinac vrstev staci jedna vychozi mapa:
         * mapa.addDefaultLayer(SMap.DEF_OPHOTO);
         */

        // Add default controls for map (zoom, move, etc.)
        this.mapa.addDefaultControls();

        this._addLayerControl();

        this._drawRoute(this._route.coordinates, this.options);
    }

    private _addLayerControl() {
        // Pridani tlacitka pro vyber mapy
        const c = new SMap.Control.Layer();
        c.addDefaultLayer(SMap.DEF_BASE);
        c.addLayer(SMap.DEF_OPHOTO, 'Satelitní', '', 'Satelitní');
        // c.addLayer(SMap.DEF_HYBRID, 'Hybridní', '', 'Hybridní');
        c.addLayer(SMap.DEF_TURIST, 'Turistická', '', 'Turistická');
        this.mapa.addControl(c, { left: '8px', top: '9px' });
    }

    private _prepareVectorPoint(data: TrackPoint[]) {
        return data.map(d => {
            return d.series.map(s => {
                return SMap.Coords.fromWGS84(s[0], s[1]);
            });
        });
    }

    private _drawRoute(data: TrackPoint[], options: { color: string; width: number }) {
        if (!this.routeLayer) {
            this.routeLayer = new SMap.Layer.Geometry();
            this.mapa.addLayer(this.routeLayer);
            this.routeLayer.enable();
        }

        this.routeLayer.removeAll();
        const points = _.flatten(this._prepareVectorPoint(data));
        const polyline = new SMap.Geometry(SMap.GEOMETRY_POLYLINE, null, points, options);
        this.routeLayer.addGeometry(polyline);
        this.routeLayer.redraw();
        this.mapa.setCenter(SMap.Coords.fromWGS84(this._route.center.lon, this._route.center.lat), true);
    }
}
