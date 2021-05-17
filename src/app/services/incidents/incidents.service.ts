import { Injectable } from '@angular/core';

import { ServerService, iIncidentsFilterV2, iIncidentV2 } from './../server/server.service';

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
export class IncidentsService
{
  private _cachedBikeTheft: iBikeTheft[];

  public constructor(
    private _serverService: ServerService)
  {
    console.log("Incidents.service - ctor");

    this._cachedBikeTheft = [];
  }

  public loadBerlinThefts(pageIndex: number, pageSize: number, filter?: iTheftFilter): Promise<iBikeTheft[]>
  {
    console.log("Incidents.service - loadIncidents");

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
          console.debug("Incidents.service - loadIncidents - Success");

          const bikeTheftsList: iBikeTheft[] = response.incidents.map(incident => this._parseBikeTheftV2(incident));

          // Save incidentsList for cache
          this._cachedBikeTheft = bikeTheftsList;

          resolve(bikeTheftsList);
        },
        (error) =>
        {
          console.error(`Incidents.service - loadIncidents - Failure [statusCode: '${ error.status }'; message: '${ error.message }']`);

          reject();
        });
    });

    return promise;
  }

  public getIncident(incidentId: number): Promise<iBikeTheft>
  {
    console.log("Incidents.service - getIncident");

    const promise = new Promise<iBikeTheft>((resolve, reject) =>
    {
      // Search incident in cache, if not found load from server
      const localIncident = this._cachedBikeTheft.find(incident => incident.id == incidentId);
      if (localIncident)
      {
        console.debug("Incidents.service - getIncident - Loaded from cache");

        resolve(localIncident);
      }
      else
      {
        this._serverService.sendRequestV2_IncidentById(incidentId).then(
          (response: { incident: iIncidentV2 }) =>
          {
            console.debug("Incidents.service - getIncident - Success");

            const bikeTheft: iBikeTheft = this._parseBikeTheftV2(response.incident);

            resolve(bikeTheft);
          },
          (error) =>
          {
            console.error(`Incidents.service - getIncident - Failure [statusCode: '${ error.status }'; message: '${ error.message }']`);

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
}