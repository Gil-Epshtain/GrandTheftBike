import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';

import * as L from 'leaflet';

import { MapService } from './../../services/map/map.service';

interface iMapPoint
{
  lat: number;
  lng: number;
}

const MAP_TILE_SOURCE = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit
{
  @ViewChild('mapEl') mapElement: ElementRef<HTMLDivElement>;

  @Input() point?: iMapPoint;

  private _mapHandler: L.Map;

  public constructor(
    private _mapService: MapService)
  {
    console.debug("Map.component - ctor");
  }

  public ngOnInit(): void
  {
  }

  public ngAfterViewInit(): void
  {
    // wait until map element had rendered
    this._initMap();
  }

  private _initMap(): void
  {
    this._mapHandler = L
      .map(this.mapElement.nativeElement)
      .setView([0, 0], 1); // default if not point location

    L.tileLayer(MAP_TILE_SOURCE).addTo(this._mapHandler);

    if (this.point?.lat &&
        this.point?.lng)
    {
      const pointLatLng: any = [this.point.lat, this.point.lng];
      const zoom = 16;

      this._mapHandler.setView(pointLatLng, zoom);

      L.marker(pointLatLng).addTo(this._mapHandler);
    }
  }
}