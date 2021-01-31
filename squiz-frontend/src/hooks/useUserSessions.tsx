import firebase from 'lib/firebase';
import max from 'lodash/max';
import maxBy from 'lodash/maxBy';
import sumBy from 'lodash/sumBy';
import { useEffect, useState } from 'react';

interface LooseObject {
  [key: string]: any;
}

export interface TStats {
  numberSessions: number;
  averageSession: number;
  longestSession: number;
  totalSession: number;
}

export interface TRecord {
  startedAt: number;
  duration: number;
  activity: string;
  preset: string;
}

export const convertRecord = (data: LooseObject) => {
  const convert: TRecord = {
    startedAt: data.started_at,
    duration: data.duration_in_seconds,
    activity: data.practice_type,
    preset: data.preset_id
  };
  return convert;
};

const useUserSessions = (userId?: string) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TStats>({
    numberSessions: 0,
    averageSession: 0,
    longestSession: 0,
    totalSession: 0
  });
  const [lastEpoch, setLastEpoch] = useState();

  const localTimestampKey = `latest_session_timestamp_user_${userId}`;
  const localStatsKey = `stats_user_${userId}`;
  const localTimestamp = localStorage.getItem(localTimestampKey) || '';
  const localStats = localStorage.getItem(localStatsKey) || '{}';
  const localStatsObj = JSON.parse(localStats);
  const startAfter = parseInt(localTimestamp, 10);

  const sessionCollection = firebase
    .firestore()
    .collection(`users/${userId}/sessions`);

  const handleStats = async () => {
    const sessionRef = localTimestamp
      ? sessionCollection
          .orderBy('created_at.epoch', 'asc')
          .startAfter(startAfter)
      : sessionCollection.orderBy('created_at.epoch', 'desc');

    const documentSnapshots = await sessionRef.get();

    if (documentSnapshots.docs.length > 0) {
      const sessions = documentSnapshots.docs.map((doc: { data: () => any }) =>
        doc.data()
      );

      let newStats = localStatsObj;

      const newTotalSession = sumBy(sessions, 'duration_in_seconds');
      const newLongestDuration: any = maxBy(sessions, 'duration_in_seconds');
      const newNumberSession = sessions.length;
      const newTimestamp: any = maxBy(sessions, 'created_at.epoch');

      if (localTimestamp) {
        const { numberSessions, totalSession, longestSession } = localStatsObj;
        const finalNumberSessions = numberSessions + sessions.length;
        const finalTotalDuration = totalSession + newTotalSession; // in minute
        const finalTotalSession = totalSession + newTotalSession;
        const finalAverageSession =
          finalTotalDuration / 60 / finalNumberSessions;
        const finalLongestSession = max([
          longestSession,
          newLongestDuration.duration_in_seconds / 60 // in minute
        ]);
        newStats = {
          numberSessions: finalNumberSessions,
          averageSession: finalAverageSession,
          longestSession: finalLongestSession,
          totalSession: finalTotalSession
        };
      } else {
        newStats = {
          numberSessions: newNumberSession,
          averageSession: newTotalSession / 60 / newNumberSession, // in minute
          longestSession: newLongestDuration.duration_in_seconds / 60, // in minute
          totalSession: newTotalSession
        };
      }

      localStorage.setItem(localStatsKey, JSON.stringify(newStats));
      localStorage.setItem(
        localTimestampKey,
        newTimestamp.created_at.epoch.toString()
      );
      setStats(newStats);
    } else {
      const defaultStats = localTimestamp ? localStatsObj : stats;
      setStats(defaultStats);
    }

    setLoading(false);
  };

  const getRecords = async (limit?: number) => {
    const records: TRecord[] = [];
    const result: LooseObject = {
      hasMore: false,
      records
    };
    const recordsCollection = sessionCollection.orderBy(
      'created_at.epoch',
      'desc'
    );
    if (limit) {
      if (!lastEpoch) {
        const documentSnapshots = await recordsCollection.limit(limit).get();

        if (documentSnapshots.docs.length > 0) {
          const lastDoc =
            documentSnapshots.docs[documentSnapshots.docs.length - 1];
          const lastData = lastDoc.data();

          setLastEpoch(lastData.created_at.epoch);

          documentSnapshots.docs.map(doc =>
            records.push(convertRecord(doc.data()))
          );

          if (documentSnapshots.docs.length >= limit) result.hasMore = true;
        }

        return result;
      }

      const nextDocumentSnapshots = await recordsCollection
        .startAfter(lastEpoch)
        .limit(limit)
        .get();

      if (nextDocumentSnapshots.docs.length > 0) {
        const nextDoc =
          nextDocumentSnapshots.docs[nextDocumentSnapshots.docs.length - 1];
        const nextData = nextDoc.data();

        setLastEpoch(nextData.created_at.epoch);

        nextDocumentSnapshots.docs.map(doc =>
          records.push(convertRecord(doc.data()))
        );

        if (nextDocumentSnapshots.docs.length >= limit) result.hasMore = true;
      }

      return result;
    }

    const documentSnapshots = await recordsCollection.get();

    documentSnapshots.docs.map(doc => records.push(convertRecord(doc.data())));

    return result;
  };

  useEffect(() => {
    if (userId) handleStats();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return { loading, stats, getRecords };
};

export default useUserSessions;
