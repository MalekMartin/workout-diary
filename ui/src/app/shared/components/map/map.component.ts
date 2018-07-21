import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'wd-map',
    templateUrl: 'map.component.html',
    styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit {
    public zoom = 11;
    // public opacity = 1.0;
    // public width = 5;

    // @Input() coordinates: number[][] = [[17.66259766, 48.94689178], [17.664335250854, 48.913745880127]];
    @Input() coordinates: number[][];
    @Input() lat: number;
    @Input() lon: number;

    ngOnInit() {
    }

    zoomIn() {
        this.zoom  = Math.min(this.zoom + 1, 18);
    }

    zoomOut() {
        this.zoom  = Math.max(this.zoom - 1, 1);
    }

//   increaseOpacity() {
//     this.opacity  = Math.min(this.opacity + 0.1, 1);
//     console.log('opacity: ', this.opacity);
//   }

//   decreaseOpacity() {
//     this.opacity  = Math.max(this.opacity - 0.1, 0);
//     console.log('opacity: ', this.opacity);
//   }
}
