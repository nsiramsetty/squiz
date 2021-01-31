import moment from 'moment';

export function convertUnixTimeStampToDate(timestamp: number): string {
  const dateTimeString = new Date(timestamp);
  return moment(dateTimeString).format('YYYY-MM-DD HH:mm');
}

export function convertDateToUnixTimeStamp(date: string): number {
  return moment(date, 'YYYY-MM-DD HH:mm').valueOf();
}
