import moment from 'moment';
import { Event } from '.';

export function isLiveNow(startAt: number, hasEnded: boolean) {
  if (startAt && Date.now() > startAt && !hasEnded) return true;
  return false;
}

export function getEventStartDateEpoch(event: Event) {
  return event._next_occurrences[0].start_date.epoch;
}

export function isActive(event: Event) {
  if (event != null) {
    const currentEpoch = moment().valueOf();
    return currentEpoch < getEventStartDateEpoch(event) + 3600000;
  }
  return false;
}

/**
 * Function to check whether event start-time is between 2 times
 * @param event = Event
 * @param start = the start time in HH:mm, eg. 06:00
 * @param end = the end time in HH:mm, eg. 22:00
 */
export function isEventTimeBetween(event: Event, start: string, end: string) {
  const eventTime = moment(getEventStartDateEpoch(event));
  const startTime = moment(start, 'H:mm');
  const endTime = moment(end, 'H:mm');

  const eventTimeInMinutes = eventTime.minutes() + eventTime.hours() * 60;
  const startTimeInMinutes = startTime.minutes() + startTime.hours() * 60;
  const endTimeInMinutes = endTime.minutes() + endTime.hours() * 60;

  return (
    eventTimeInMinutes >= startTimeInMinutes &&
    eventTimeInMinutes <= endTimeInMinutes
  );
}

export function getDisplayTime(startAt: number, hasEnded: boolean) {
  const currentTime = moment();
  const liveTime = moment(startAt);

  if (isLiveNow(startAt, hasEnded)) return 'Live Now';

  /*
   * If [time to event] is under 1 hour, display units in minutes => ex. IN 24 MINS
   */
  if (liveTime.diff(currentTime, 'minutes') < 60) {
    const minutes = liveTime.diff(currentTime, 'minutes');
    const minutesText = minutes > 1 ? 'mins' : 'min';

    return `in ${minutes} ${minutesText} - ${moment(startAt)
      .local()
      .format('h:mmA')}`;
  }

  /* If [time to event] is between 1 and 3 hours, display units in hours => ex. IN 3 HRS
   */
  if (liveTime.diff(currentTime, 'hours') <= 3) {
    const hours = liveTime.diff(currentTime, 'hours');
    const hoursText = hours > 1 ? 'hrs' : 'hr';

    return `in ${hours} ${hoursText} - ${moment(startAt)
      .local()
      .format('h:mmA')}`;
  }

  /*
   * If [time to event] is more than 3 hours and within 'today', display 'TODAY'' and time of event => ex. TODAY - 5:30PM
   */
  if (moment().isSame(moment(startAt), 'day'))
    return `Today - ${moment(startAt).local().format('h:mmA')}`;

  /*
   * If [time to event] is between 1 and 3 hours, display units in hours => ex. IN 3 HRS
   */
  const tomorrowDay = moment().add(1, 'day').endOf('day');
  if (moment(startAt).isSame(moment(tomorrowDay), 'day')) {
    return `Tomorrow - ${moment(startAt).local().format('h:mmA')}`;
  }

  /*
   * If [time to event] is in more than 24hrs but less than 1 week, display day of week and time of event => ex. WED - 4:30PM
   */
  if (moment().isSame(moment(startAt), 'isoWeek'))
    return moment(startAt).local().format('ddd - h:mmA');

  /*
   * If [time to event] is in more than 24hrs, display time and date => ex. 2 SEP - 2:00AM
   */
  return moment(startAt).local().format('D MMM - h:mmA');
}

export function getStartDateFilter(
  type: 'today' | 'tomorrow' | 'this_week' | 'next_week' | 'weekend'
) {
  switch (type) {
    case 'today':
      return {
        start_date_from: moment().startOf('day').valueOf(),
        start_date_to: moment().endOf('day').valueOf()
      };
    case 'tomorrow':
      return {
        start_date_from: moment().add(1, 'days').startOf('day').valueOf(),
        start_date_to: moment().add(1, 'days').endOf('day').valueOf()
      };
    case 'this_week':
      return {
        start_date_from: moment().startOf('day').valueOf(),
        start_date_to: moment().endOf('isoWeek').valueOf()
      };
    case 'next_week':
      return {
        start_date_from: moment().add(1, 'weeks').startOf('isoWeek').valueOf(),
        start_date_to: moment().add(1, 'weeks').endOf('isoWeek').valueOf()
      };
    case 'weekend':
      return {
        start_date_from: moment()
          .isoWeekday('Saturday')
          .startOf('day')
          .valueOf(), // start from Saturday
        start_date_to: moment().endOf('isoWeek').valueOf()
      };

    default:
      return {};
  }
}
