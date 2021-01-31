import firebase from 'lib/firebase';
import { firestore } from 'lib/firebase/firestore';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

export enum SessionType {
  Guided = 'Guided',
  DailyInsight = 'DailyInsight',
  Course = 'Course',
  Timer = 'Timer',
  Journal = 'Journal',
  Playlist = 'Playlist',
  PlaylistItem = 'PlaylistItem'
}

export enum PracticeType {
  Meditation = 'Meditation',
  Yoga = 'Yoga',
  TaiChi = 'TaiChi',
  Walking = 'Walking',
  Breathing = 'Breathing',
  Chanting = 'Chanting',
  Prayer = 'Prayer',
  Healing = 'Healing'
}

export function writeCourseSession(
  userId: string,
  courseId: string,
  courseDayId: string,
  duration: number
): object {
  const now = moment();
  const id: string = uuidv4();
  const localCalenderDay = now.format('YYYY-MM-DD');
  const timeZone = now.format('Z');
  const daysInUnix = now.diff('1970-01-01', 'days');
  const durationInSeconds = Math.floor(duration);
  const millisecondsEpoch = now.valueOf();
  const ISODateTime = now.toISOString();

  return firestore.doc(`users/${userId}/sessions/${id}`).set({
    id,
    type: SessionType.Course,
    local_calendar_day: localCalenderDay,
    practice_type: PracticeType.Meditation,
    item_id: courseId,
    sub_id: courseDayId,
    timezone: timeZone,
    days_in_unix: daysInUnix,
    duration_in_seconds: durationInSeconds,
    started_at: millisecondsEpoch,
    is_private: false,
    created_at: {
      epoch: millisecondsEpoch,
      iso_8601_datetime_tz: ISODateTime
    },
    updated_at: {
      epoch: millisecondsEpoch,
      iso_8601_datetime_tz: ISODateTime
    },
    synced_at: firebase.firestore.FieldValue.serverTimestamp()
  });
}
