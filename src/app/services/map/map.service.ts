import { Injectable } from '@angular/core';

import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapService
{
  public constructor()
  {
    console.log("Map.service - ctor");

    this._fixLeafletMarker();
  }

  private _fixLeafletMarker(): void
  {
    // BUG: L.Icon.Default - wrong Icon Image URL
    // https://github.com/Leaflet/Leaflet/issues/4968
    // https://stackoverflow.com/a/51232969/2658683

    const iconImage2xUrl = 'assets/leaflet/marker-icon-2x.png';
    const iconImageUrl   = 'assets/leaflet/marker-icon.png';
    const iconShadowUrl  = 'assets/leaflet/marker-shadow.png';

    const iconDefault = L.icon(
    {
      iconRetinaUrl: iconImage2xUrl,
      iconUrl: iconImageUrl,
      shadowUrl: iconShadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });

    L.Marker.prototype.options.icon = iconDefault;
  }
}