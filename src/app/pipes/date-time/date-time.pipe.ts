import { Pipe, PipeTransform } from '@angular/core';

import { DateTimeService } from './../../services/date-time/date-time.service';

@Pipe({
  name: 'dateTime'
})
export class DateTimePipe implements PipeTransform
{
  public constructor(
    private _dateTimeService: DateTimeService)
  {
  }

  public transform(value: string | number): string
  {
    const transformValue = this._dateTimeService.getDateTimeString(value);

    console.debug(`Date-Time.pipe - transform [${ value } >> ${ transformValue }]`);

    return transformValue;
  }
}