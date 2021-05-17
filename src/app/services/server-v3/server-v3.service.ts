import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface iSearchRequest
{
  page?: number;
  per_page?: number;
  query?: string;
  serial?: string;
  manufacturer?: string;
  colors?: string;
  location?: string;
  distance?: number;
  stolenness?: string;
}

export interface iSearchResponse
{
  id: number;

  title: string;
  description: string;
  manufacturer_name: string;
  year: number
  serial: string;
  frame_model: string;
  frame_colors: string[];
  url: string;

  date_stolen: number;

  is_stock_img: boolean;
  large_img: string;
  thumb: string;

  location_found: any; // ?
  external_id: any; // ?
  registry_name: any; // ?
  registry_url: any; // ?
  status: any; // ?

  stolen: boolean;
  stolen_location: string;
}

export interface iBikeResponse
{
  id: number;

  title: string;
  description: string;

  manufacturer_id: number;
  manufacturer_name: string;
  year: number;
  serial: string;

  frame_model: string;
  frame_colors: string[];
  frame_size: any; // ?
  frame_material_slug: any; // ?

  url: string;
  api_url: string;

  date_stolen: number;
  registration_created_at: number;
  registration_updated_at: number;

  is_stock_img: boolean;
  large_img: string;
  thumb: string;

  stolen: boolean;
  stolen_location: string;
  stolen_record:
  {
    id: number;
    date_stolen: number;

    location: string;
    latitude: number;
    longitude: number;

    theft_description: string;
    locking_description: string;
    lock_defeat_description: string;
    police_report_number: string;
    police_report_department: string;
    created_at: number;
    create_open311: boolean;
  },

  location_found: any;
  external_id: any;
  registry_name: string;
  registry_url: string;
  status: any;
  paint_description: string;
  name: string;
  rear_tire_narrow: boolean;
  front_tire_narrow: boolean;
  type_of_cycle: string;
  test_bike: boolean;
  rear_wheel_size_iso_bsd: any;
  front_wheel_size_iso_bsd: any;
  handlebar_type_slug: any;
  front_gear_type_slug: any;
  rear_gear_type_slug: any;
  additional_registration: any;

  public_images:
  {
    id: number;
    name: string;
    full: string;
    large: string;
    medium: string;
    thumb: string;
  } [];

  components: any[];
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

  public sendRequest_BikesList(filter: iSearchRequest): Promise<{ bikes: iSearchResponse[]; }>
  {
    console.log("Server-V3.service - sendRequest_BikesList");

    const url: string = `${ this._serverUrl }/v3/search`;

    const paramsObj = filter as { [param: string]: string };
    const params: HttpParams = new HttpParams({ fromObject: paramsObj });

    return this._GET(url, params);
  }

  public sendRequest_BikesListCount(filter: iSearchRequest): Promise<any>
  {
    console.log("Server-V3.service - sendRequest_BikesListCount");

    throw new Error("sendRequest_BikesListCount - TBD"); // $G$
  }

  public sendRequest_BikeById(bikeId: number): Promise<{ bike: iBikeResponse; }>
  {
    console.log("Server-V3.service - sendRequest_BikeById");

    const url: string = `${ this._serverUrl }/v3/bikes/${ bikeId }`;

    return this._GET(url);
  }
}