import { Injectable } from '@angular/core';

import { ServerService, iIncidentRequest } from './../server/server.service';

export enum eIncidentType
{
  Crash = "Crash",
  Hazard = "Hazard",
  Theft = "Theft",
  Unconfirmed = "Unconfirmed"
}

export interface iIncident
{
  id: number;
  title: string;
  description: string;
  address: string;
  occurred_at: number, // dateTime
  updated_at: number, // dateTime
  url: string;
  source:
  {
    name: string;
    html_url: string;
    api_url: string;
  },
  media:
  {
    image_url: string;
    image_url_thumb: string;
  },
  location_type: any; // ??
  location_description: any; // ??
  type: eIncidentType;
  type_properties: { [propertyKey: string]: any; }; // different objects per each type
}

export interface iTheftFilter
{
  title?: string;
  from?: number;
  to?: number;
}

@Injectable({
  providedIn: 'root'
})
export class IncidentsService
{
  public constructor(
    private _serverService: ServerService)
  {
    console.log("Incidents.service - ctor");
  }

  public loadBerlinThefts(pageIndex: number, pageSize: number, filter?: iTheftFilter): Promise<iIncident[]>
  {
    console.log("Incidents.service - loadIncidents");

    const promise = new Promise<iIncident[]>((resolve, reject) =>
    {
      const requestData: iIncidentRequest =
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

      this._serverService.sendRequest_IncidentsList(requestData).then(
        (response) =>
        {
          console.debug("Incidents.service - loadIncidents - Success");

          resolve(response.incidents);
        },
        (error) =>
        {
          console.error(`Incidents.service - loadIncidents - Failure [statusCode: '${ error.status }'; message: '${ error.message }']`);

          reject();
        });
    });

    return promise;
  }
}