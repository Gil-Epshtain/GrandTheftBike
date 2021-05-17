import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface iIncidentsFilter
{
  page?: number;
  per_page?: number;
  occurred_before?: number;
  occurred_after?: number;
  incident_type?: string;
  proximity?: string;
  proximity_square?: number;
  query?: string;
}

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
  location_type: any;
  location_description: any;
  type: eIncidentType;
  type_properties: { [propertyKey: string]: any; }; // different objects per each type
}

@Injectable({
  providedIn: 'root'
})
export class ServerV2Service
{
  private _serverUrl: string;

  public constructor(
    private _httpClient: HttpClient)
  {
    console.log("Server-V2.service - ctor");

    this._serverUrl = "https://bikewise.org:443/api";
  }

  private _GET<T = any>(url: string, params: HttpParams = null): Promise<T>
  {
    return this._httpClient.get(url, { params }).toPromise<any>();
  }

  public sendRequest_IncidentsList(filter: iIncidentsFilter): Promise<{ incidents: iIncident[]; }>
  {
    console.log("Server-V2.service - sendRequest_IncidentsList");

    const url: string = `${ this._serverUrl }/v2/incidents`;

    const paramsObj = filter as { [param: string]: string };
    const params: HttpParams = new HttpParams({ fromObject: paramsObj });

    return this._GET(url, params);
  }

  public sendRequest_IncidentById(incidentId: number): Promise<{ incident: iIncident; }>
  {
    console.log("Server-V2.service - sendRequest_IncidentById");

    const url: string = `${ this._serverUrl }/v2/incidents/${ incidentId }`;

    return this._GET(url);
  }
}