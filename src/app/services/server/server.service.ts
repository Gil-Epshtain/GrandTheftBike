import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

// -------------------------------------------------------------------------
// API V2
export interface iIncidentsFilterV2
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

export interface iIncidentV2
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

// -------------------------------------------------------------------------
// API V3
export interface iBikeRequestV3
{
  page?: number;
  per_page?: number;
  query?: string;
  location?: string;
  distance?: string;
  stolenness?: string;
}

export interface iBikeResponseV3
{
}

@Injectable({
  providedIn: 'root'
})
export class ServerService
{
  private _serverUrl_v2: string;
  private _serverUrl_v3: string;

  public constructor(
    private _httpClient: HttpClient)
  {
    console.log("Server.service - ctor");

    this._serverUrl_v2 = "https://bikewise.org:443/api";
    this._serverUrl_v3 = "https://bikeindex.org:443/api";
  }

  private _GET<T = any>(url: string, params: HttpParams = null): Promise<T>
  {
    return this._httpClient.get(url, { params }).toPromise<any>();
  }

  // -------------------------------------------------------------------------
  // API V2
  public sendRequestV2_IncidentsList(filter: iIncidentsFilterV2): Promise<{ incidents: iIncidentV2[]; }>
  {
    console.log("Server.service - sendRequestV2_IncidentsList");

    const url: string = `${ this._serverUrl_v2 }/v2/incidents`;

    const paramsObj = filter as { [param: string]: string };
    const params: HttpParams = new HttpParams({ fromObject: paramsObj });

    return this._GET(url, params);
  }

  public sendRequestV2_IncidentById(incidentId: number): Promise<{ incident: iIncidentV2; }>
  {
    console.log("Server.service - sendRequestV2_IncidentById");

    const url: string = `${ this._serverUrl_v2 }/v2/incidents/${ incidentId }`;

    return this._GET(url);
  }

  // -------------------------------------------------------------------------
  // API V2
  public sendRequestV3_BikesList(filter: iBikeRequestV3): Promise<any>
  {
    console.log("Server.service - sendRequestV3_BikesList");

    const url: string = `${ this._serverUrl_v3 }/v3/search`;

    const paramsObj = filter as { [param: string]: string };
    const params: HttpParams = new HttpParams({ fromObject: paramsObj });

    return this._GET(url, params);
  }

  public sendRequestV3_BikesListCount(filter: iBikeRequestV3): Promise<any>
  {
    console.log("Server.service - sendRequestV3_BikesListCount");

    throw new Error("sendRequestV3_BikesListCount - TBD"); // $G$
  }

  public sendRequestV3_BikeById(bikeId: number): Promise<any>
  {
    console.log("Server.service - sendRequestV3_incidentById");

    const url: string = `${ this._serverUrl_v3 }/v3/bikes/${ bikeId }`;

    return this._GET(url);
  }
}