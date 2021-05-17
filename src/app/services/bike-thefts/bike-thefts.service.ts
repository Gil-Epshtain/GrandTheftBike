import { Injectable } from '@angular/core';

import { ServerService, iIncidentsFilterV2, iIncidentV2 } from '../server/server.service';

export interface iTheftFilter
{
  title?: string;
  from?: number;
  to?: number;
}

export interface iBikeTheft
{
  id: number;
  title: string;
  description: string;
  dateTheft: number;
  dateReport: number;
  address: string;
  location:
  {
    lat: number;
    lng: number;
  };
  media:
  {
    imageUrl: string;
    imageUrlThumb: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BikeTheftsService
{
  // Save thefts-list in cache when loading.
  // When fetching single theft, search in cache before requesting from server.
  private _cachedBikeTheft: iBikeTheft[];

  public constructor(
    private _serverService: ServerService)
  {
    console.log("Bike-Thefts.service - ctor");

    this._cachedBikeTheft = [];
  }

  // -------------------------------------------------------------------------------------------
  // API V2
  public loadBerlinTheftsIncidents(pageIndex: number, pageSize: number, filter?: iTheftFilter): Promise<iBikeTheft[]>
  {
    console.log("Bike-Thefts.service - loadBerlinTheftsIncidents");

    const promise = new Promise<iBikeTheft[]>((resolve, reject) =>
    {
      const requestData: iIncidentsFilterV2 =
      {
        page: (pageIndex + 1), // mat-paginator is zero-based index. API is 1-based index.
        per_page: pageSize,

        // Const filters
        incident_type: "theft",
        proximity: "52.50985, 13.40051", // Berlin center
        proximity_square: 50, // Metropolitan size
      };

      // User filters
      if (filter?.title)
      {
        requestData.query = filter?.title;
      }
      if (filter?.from)
      {
        requestData.occurred_after = filter?.from;
      }
      if (filter?.to)
      {
        requestData.occurred_before = filter?.to;
      }

      this._serverService.sendRequestV2_IncidentsList(requestData).then(
        (response: { incidents: iIncidentV2[] }) =>
        {
          console.debug("Bike-Thefts.service - loadBerlinTheftsIncidents - Success");

          const bikeTheftsList: iBikeTheft[] = response.incidents.map(incident => this._parseBikeTheftV2(incident));

          this._cachedBikeTheft = bikeTheftsList;

          resolve(bikeTheftsList);
        },
        (error) =>
        {
          console.error(`Bike-Thefts.service - loadBerlinTheftsIncidents - Failure [statusCode: '${ error.status }'; message: '${ error.message }']`);

          reject();
        });
    });

    return promise;
  }

  public getIncident(incidentId: number): Promise<iBikeTheft>
  {
    console.log("Bike-Thefts.service - getIncident");

    const promise = new Promise<iBikeTheft>((resolve, reject) =>
    {
      // Search incident in cache, if not found load from server
      const localTheft = this._cachedBikeTheft.find(incident => incident.id == incidentId);
      if (localTheft)
      {
        console.debug("Bike-Thefts.service - getIncident - Loaded from cache");

        resolve(localTheft);
      }
      else
      {
        this._serverService.sendRequestV2_IncidentById(incidentId).then(
          (response: { incident: iIncidentV2 }) =>
          {
            console.debug("Bike-Thefts.service - getIncident - Success");

            const bikeTheft: iBikeTheft = this._parseBikeTheftV2(response.incident);

            resolve(bikeTheft);
          },
          (error) =>
          {
            console.error(`Bike-Thefts.service - getIncident - Failure [statusCode: '${ error.status }'; message: '${ error.message }']`);

            reject();
          });
      }
    });

    return promise;
  }

  private _parseBikeTheftV2(incident: iIncidentV2): iBikeTheft
  {
    const bikeTheft: iBikeTheft =
    {
      id:           incident.id,
      title:        incident.title,
      description:  incident.description,
      dateTheft:    incident.occurred_at,
      dateReport:   incident.updated_at,
      address:      incident.address,
      location:     null, // missing in api v2?
      media:
      {
        imageUrl:      incident.media.image_url,
        imageUrlThumb: incident.media.image_url_thumb
      }
    };

    return bikeTheft;
  }

  // -------------------------------------------------------------------------------------------
  // API V3
}