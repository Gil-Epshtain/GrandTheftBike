import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface iIncidentRequest
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

@Injectable({
  providedIn: 'root'
})
export class ServerService
{
  private _serverUrl: string;

  public constructor(
    private _httpClient: HttpClient)
  {
    console.log("Server.service - ctor");

    this._serverUrl = "https://bikewise.org:443/api";
  }

  public sendRequest_IncidentsList(filter: iIncidentRequest): Promise<any>
  {
    console.log("Server.service - sendRequest_IncidentsList");

    const url: string = `${ this._serverUrl }/v2/incidents`;

    const paramsObj = filter as { [param: string]: string };
    const params: HttpParams = new HttpParams({ fromObject: paramsObj });

    return this._httpClient.get(url, { params }).toPromise();
  }

  // public sendRequest_incidentById(incidentId: number): Promise<any>
  // {
    
  // }
}