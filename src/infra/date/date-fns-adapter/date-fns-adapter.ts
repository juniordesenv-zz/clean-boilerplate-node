import { add } from 'date-fns';
import { IncrementDate } from '@/data/protocols/date/increment-date';


export class DateFnsAdapter implements IncrementDate {
  add(date: Date, duration: Duration): Date {
    const result = add(date, duration);
    return result;
  }
}
