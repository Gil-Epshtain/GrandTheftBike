import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface iBikeRequest
{
  page?: number;
  per_page?: number;
  query?: string;
  location?: string;
  distance?: string;
  stolenness?: string;
}

export interface iBikeResponse
{
}

@Injectable({
  providedIn: 'root'
})
export class ServerV3Service
{
  private _serverUrl: string;

  public constructor(
    private _httpClient: HttpClient)
  {
    console.log("Server-V3.service - ctor");

    this._serverUrl = "https://bikeindex.org:443/api";
  }

  private _GET<T = any>(url: string, params: HttpParams = null): Promise<T>
  {
    return this._httpClient.get(url, { params }).toPromise<any>();
  }

  public sendRequest_BikesList(filter: iBikeRequest): Promise<any>
  {
    console.log("Server-V3.service - sendRequest_BikesList");

    const url: string = `${ this._serverUrl }/v3/search`;

    const paramsObj = filter as { [param: string]: string };
    const params: HttpParams = new HttpParams({ fromObject: paramsObj });

    return this._GET(url, params);
  }

  public sendRequest_BikesListCount(filter: iBikeRequest): Promise<any>
  {
    console.log("Server-V3.service - sendRequest_BikesListCount");

    throw new Error("sendRequest_BikesListCount - TBD"); // $G$
  }

  public sendRequest_BikeById(bikeId: number): Promise<any>
  {
    console.log("Server-V3.service - sendRequest_BikeById");

    const url: string = `${ this._serverUrl }/v3/bikes/${ bikeId }`;

    return this._GET(url);
  }
}