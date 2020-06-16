export type Duration = {
  years?: number
  months?: number
  weeks?: number
  days?: number
  hours?: number
  minutes?: number
  seconds?: number
};

export interface IncrementDate {
  add (date: Date, duration: Duration): Date
}
