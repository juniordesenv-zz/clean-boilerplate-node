import faker from 'faker';
import { Duration, IncrementDate } from '@/data/protocols/date/increment-date';

export class DateSpy implements IncrementDate {
  futureDate = faker.date.future();

  date;

  duration;

  callsCount = 0;

  add(date: Date, duration: Duration): Date {
    this.callsCount += 1;
    this.date = date;
    this.duration = duration;
    return this.futureDate;
  }
}
