import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { TrackPoints, TrackPoint, Coordinate } from '../../../core/workout/workout.interface';
import * as _ from 'lodash';

const ZOOMS = [
    {value: 2, distance: 4500000000},
    {value: 3, distance: 2400000000},
    {value: 4, distance: 1200000},
    {value: 5, distance: 600000},
    {value: 6, distance: 300000},
    {value: 7, distance: 150000},
    {value: 8, distance: 75000},
    {value: 9, distance: 36000},
    {value: 10, distance: 18000},
    {value: 11, distance: 9000},
    {value: 12, distance: 4500},
    {value: 13, distance: 2400},
    {value: 14, distance: 1200},
    {value: 15, distance: 600},
    {value: 16, distance: 300},
    {value: 17, distance: 150},
    {value: 18, distance: 75},
];

@Component({
    selector: 'wd-smap',
    templateUrl: 'smap.component.html',
    styleUrls: ['./smap.component.scss']
})
export class SMapComponent implements OnInit, OnDestroy {
    @Input()
    set route(r: TrackPoints) {
        if (!!r) {
            this._distances = r.distance;
            if (!this._route) {
                this._route = r;
            } else {
                this._route = r;
                this._drawRoute(this._route.coordinates, this.options);
            }
        }
    }

    // @Input() set distances(d: Coordinate) {
    //     this._distances = d;
    // }

    options = { color: 'red', width: 3 };

    mapa;
    routeLayer;
    zoomBarWidth = 182;

    expanded = false;

    private _route: TrackPoints;
    private _onDestroy$ = new Subject();
    private _defaultZoom = 12;
    private _zooms = ZOOMS;
    private _distances: Coordinate;

    constructor(private _cd: ChangeDetectorRef,
        private _el: ElementRef) {}

    ngOnInit() {
        this.prepareLoader();
        // console.log(this._el.nativeElement.offsetWidth);
        // console.log(this._el.nativeElement.offsetHeight);
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
        this.mapa = new SMap(JAK.gel('mapa'), stred, this._defaultZoom);
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
        this._getZoomBarWidth();
        this._defaultZoom = this._getZoom(this._distances);
        this.mapa.setCenterZoom(
            SMap.Coords.fromWGS84(this._route.center.lon, this._route.center.lat),
            this._defaultZoom,
            true
        );
    }

    private _getMinZoom(distance: number) {
        return _.maxBy(
            this._zooms.filter(z => {
                return z.distance > distance;
            }),
            'value'
        );
    }

    private _getZoom(distances: Coordinate) {
        if (!distances) {
            return 12;
        }
        const lat = this._getMinZoom(distances.lat);
        const lon = this._getMinZoom(distances.lon);

        if (lat >= lon) {
            const width = this._el.nativeElement.offsetHeight;
            const viewHeiht = width / this.zoomBarWidth;
            if (viewHeiht > 0) {
                return lat.value;
            } else {
                return lat.value - 1;
            }
        } else {
            const width = this._el.nativeElement.offsetWidth;
            const viewWidth = width / this.zoomBarWidth;
            if (viewWidth > 0) {
                return lon.value;
            } else {
                return lon.value - 1;
            }
        }
    }

    private _getZoomBarWidth() {
        const el = this._el.nativeElement.querySelector('.parts') as HTMLElement;
        if (!!el) {
            this.zoomBarWidth = el.offsetWidth;
        }
    }
}
