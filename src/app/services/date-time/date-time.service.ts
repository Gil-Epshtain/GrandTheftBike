import { Injectable } from '@angular/core';

import * as moment from 'moment';

// In real app, load these from app settings config file

// German format
const DATE_FORMAT = "YYYY-MM-DD";
const TIME_FORMAT = "HH:mm";
const LOCALE_CODE = "de";

@Injectable({
  providedIn: 'root'
})
export class DateTimeService
{
  public constructor()
  {
    console.debug("Date-Time.service - ctor");
  }

  public getDateTimeString(dateTime?: string | number | moment.Moment): string
  {
    const dateFormat = DATE_FORMAT;
    const timeFormat = TIME_FORMAT;

    return this.getLocalDateTime(dateTime).format(`${ dateFormat } ${ timeFormat }`);
  }

  public getLocalDateTime(dateTime?: string | number | moment.Moment): moment.Moment
  {
    const localeCode = LOCALE_CODE;

    return moment(dateTime).locale(localeCode);
  }
}