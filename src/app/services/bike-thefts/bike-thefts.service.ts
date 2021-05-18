import { Injectable } from '@angular/core';

import { ServerV2Service, iIncidentsFilter, iIncident } from '../server-v2/server-v2.service';
import { ServerV3Service, iSearchRequest, iSearchResponse, iSearchCountRequest, iBikeResponse } from '../server-v3/server-v3.service';

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
  dateReport?: number;
  address: string;
  location?:
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

const BERLIN_CENTER = "52.50985, 13.40051";
const METROPOLITAN_SIZE = 50;

@Injectable({
  providedIn: 'root'
})
export class BikeTheftsService
{
  // For API V2 only!
  // Save thefts-list in cache when loading.
  // When fetching single theft, search in cache before requesting from server.
  private _cachedBikeTheft: iBikeTheft[];

  public constructor(
    private _serverV2Service: ServerV2Service,
    private _serverV3Service: ServerV3Service)
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
      const requestData: iIncidentsFilter =
      {
        page: (pageIndex + 1), // mat-paginator is zero-based index. API is 1-based index.
        per_page: pageSize,

        // Const filters
        incident_type: "theft",
        proximity: BERLIN_CENTER,
        proximity_square: METROPOLITAN_SIZE
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

      this._serverV2Service.sendRequest_IncidentsList(requestData).then(
        (response: { incidents: iIncident[] }) =>
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
        this._serverV2Service.sendRequest_IncidentById(incidentId).then(
          (response: { incident: iIncident }) =>
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

  private _parseBikeTheftV2(incident: iIncident): iBikeTheft
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
  public loadBerlinBikeThefts(pageIndex: number, pageSize: number, filter?: iTheftFilter): Promise<
    {
      list: iBikeTheft[],
      total: number
    }>
  {
    console.log("Bike-Thefts.service - loadBerlinBikeThefts");

    const promise = new Promise<
      {
        list: iBikeTheft[],
        total: number
      }>((resolve, reject) =>
    {
      const countRequestData: iSearchCountRequest =
      {
        // Const filters
        location: BERLIN_CENTER,
        distance: METROPOLITAN_SIZE,
        stolenness: "stolen" // Only stolen bikes
      };

      // User filters
      if (filter?.title)
      {
        countRequestData.query = filter?.title;
      }
      // $G$ filter from/to
      // if (filter?.from)
      // {
      //   countRequestData.occurred_after = filter?.from;
      // }
      // if (filter?.to)
      // {
      //   countRequestData.occurred_before = filter?.to;
      // }

      const requestData: iSearchRequest = Object.assign({
        page: (pageIndex + 1), // mat-paginator is zero-based index. API is 1-based index.
        per_page: pageSize,
      }, countRequestData);

      Promise.all([
        this._serverV3Service.sendRequest_BikesList(requestData),
        this._serverV3Service.sendRequest_BikesListCount(countRequestData)
      ]).then(
        (result) =>
        {
          const search = result[0],
                 count = result[1];

          const bikeTheftsList: iBikeTheft[] = search.bikes.map(bike => this._parsePartialBikeTheftV3(bike));

          // NO CACHE! Can't cache in API v3
          // Response difference between searching bikes-list and loafing single bike >> iSearchResponse != iBikeResponse

          resolve({
            list: bikeTheftsList,
            total: count.stolen
          });
        },
        () =>
        {
          console.error("Bike-Thefts.service - loadBerlinBikeThefts - Failure");

          reject();
        });
    });

    return promise;
  }

  public getBikeTheft(bikeId: number): Promise<iBikeTheft>
  {
    console.log("Bike-Thefts.service - getBikeTheft");

    const promise = new Promise<iBikeTheft>((resolve, reject) =>
    {
      this._serverV3Service.sendRequest_BikeById(bikeId).then(
        (response: { bike: iBikeResponse }) =>
        {
          console.debug("Bike-Thefts.service - getBikeTheft - Success");

          const bikeTheft: iBikeTheft = this._parseBikeTheftV3(response.bike);

          resolve(bikeTheft);
        },
        (error) =>
        {
          console.error(`Bike-Thefts.service - getBikeTheft - Failure [statusCode: '${ error.status }'; message: '${ error.message }']`);

          reject();
        });
    });

    return promise;
  }

  private _parsePartialBikeTheftV3(rawBikeObj: iSearchResponse): iBikeTheft
  {
    // Same as _parseBikeTheftV3 but without location and dateReport, properties missing on iSearchResponse
    // Used when displaying items in a list, without a map. So no need for location data
    const bikeTheft: iBikeTheft =
    {
      id:           rawBikeObj.id,
      title:        rawBikeObj.title,
      description:  rawBikeObj.description,
      dateTheft:    rawBikeObj.date_stolen,
      address:      rawBikeObj.stolen_location,
      media:
      {
        imageUrl:      rawBikeObj.large_img,
        imageUrlThumb: rawBikeObj.thumb
      }
    };

    return bikeTheft;
  }

  private _parseBikeTheftV3(rawBikeObj: iBikeResponse): iBikeTheft
  {
    const bikeTheft: iBikeTheft =
    {
      id:           rawBikeObj.id,
      title:        rawBikeObj.title,
      description:  rawBikeObj.stolen_record?.theft_description || rawBikeObj.description, // description on main object is empty
      dateTheft:    rawBikeObj.date_stolen,
      dateReport:   rawBikeObj.registration_created_at,
      address:      rawBikeObj.stolen_location,
      location:
      {
        lat: rawBikeObj.stolen_record?.latitude,
        lng: rawBikeObj.stolen_record?.longitude
      },
      media:
      {
        imageUrl:      rawBikeObj.large_img,
        imageUrlThumb: rawBikeObj.thumb
      }
    };

    return bikeTheft;
  }
}