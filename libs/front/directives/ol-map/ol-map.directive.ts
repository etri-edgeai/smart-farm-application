import { Directive, Input, ElementRef } from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import { fromLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';

@Directive({
  selector: '[olMap]',
  standalone: true,
})
export class OlMapDirective {
  @Input() coordinate: { lng: number, lat: number } | undefined = undefined;

  map: Map = new Map();
  view: View = new View();
  tileLayer: TileLayer<XYZ> = new TileLayer();
  marker: VectorLayer<VectorSource> = new VectorLayer();
  markerPoint: Point = new Point(fromLonLat([0, 0]));
  flag = false;
  zoomOut = 17;
  zoomIn = 19;
  prevLng: number | undefined = undefined;
  prevLat: number | undefined = undefined;

  constructor(
    private hostElement: ElementRef<HTMLElement>
  ) { }
  
  ngOnInit(){ }

  ngOnDestroy(){ }

  ngOnChanges(changes: any){
    for(let propName in changes){
      if(propName === 'coordinate' && this.coordinate){
        const { lng, lat } = changes['coordinate'].currentValue;
        const coordinate = fromLonLat([lng, lat]);

        if(this.isSameCoordinate(changes['coordinate'])) return;

        if(this.flag == true){
          this.flyTo(coordinate, () => this.markerPoint.setCoordinates(coordinate));
        }else{
          this.initMap();
          this.flag = true;
        }
      }
    }
  }

  private isSameCoordinate(coordinate: any): boolean {
    const currLng = coordinate.currentValue.lng;
    const currLat = coordinate.currentValue.lat;
    const flag = ((currLng == this.prevLng) && (currLat == this.prevLat)) ? true : false;
    this.prevLng = currLng; 
    this.prevLat = currLat;

    return flag;
  }

  flyTo(coordinate: any, finish: Function){
    const duration = 2000;
    let parts = 2;
    let called = false;
    const callback = (complete: any) => {
      --parts;
      if(called) return;
      if(parts === 0 || !complete){
        called = true;
        finish(complete);
      }
    };

    this.view.animate({
        center: coordinate,
        duration: duration,
      },
      callback
    );

    this.view.animate({
        zoom: this.zoomOut,
        duration: duration,
      }, {
        zoom: this.zoomIn,
        duration: duration,
      },
      callback
    );
  }

  private setMarker(): void {
    this.markerPoint.setCoordinates(fromLonLat([this.coordinate['lng'], this.coordinate['lat']]));
    
    this.marker.setSource(new VectorSource({
      features: [
        new Feature({ geometry : this.markerPoint })
      ]}
    ));
    this.marker.setStyle(new Style({
      image: new Icon({
        scale: .7, anchor: [0.5, 1],
        src: '//raw.githubusercontent.com/jonataswalker/map-utils/master/images/marker.png'
      })
    }));
  }

  private setTileLayer(): void {
    this.tileLayer.setSource(new XYZ({
      // TODO: siteConfig에 따른 맵 라이브러리 선택
      url: 'https://api.vworld.kr/req/wmts/1.0.0/D840CF34-1C7B-37A6-B68B-81E7137D7CF0/Base/{z}/{y}/{x}.png'
    }));
  }

  private setViewOptions(): void {
    this.view.setCenter(fromLonLat([this.coordinate['lng'], this.coordinate['lat']]));
    this.view.setZoom(this.zoomIn);
  };

  private initialize(...func: any){
    func.reduce((prevFunc: any, nextFunc: any) => {
      console.log(nextFunc);
      nextFunc();
    }, (init: any) => init);
  }

  private initMap(): void {
    console.log("init map~!");
    this.setMarker();
    this.setTileLayer();
    this.setViewOptions();

    this.map.setTarget(this.hostElement.nativeElement);
    this.map.setView(this.view);
    this.map.setLayers([
      this.tileLayer,
      this.marker
    ]);
  }
}
