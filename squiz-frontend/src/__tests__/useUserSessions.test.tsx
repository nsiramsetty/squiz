import { renderHook } from '@testing-library/react-hooks';
import useUserSessions from 'hooks/useUserSessions';
import { mockFirebase } from 'lib/testUtils/mockedFirebase';

const mockUserId = 'user-id';
const storageKey1 = `latest_session_timestamp_user_${mockUserId}`;
const storageKey2 = `stats_user_${mockUserId}`;

describe('User sessions hook tests', () => {
  beforeEach(() => {
    mockFirebase({
      user: {
        uid: mockUserId,
        displayName: 'Darth Vader'
      },
      collections: {
        [`users/${mockUserId}/sessions`]: [
          {
            duration_in_seconds: 10,
            created_at: {
              epoch: 1000
            }
          },
          {
            duration_in_seconds: 20,
            created_at: {
              epoch: 1001
            }
          },
          {
            duration_in_seconds: 15,
            created_at: {
              epoch: 1002
            }
          },
          {
            duration_in_seconds: 5,
            created_at: {
              epoch: 1003
            }
          }
        ]
      }
    });
  });

  test('Initial data state is loading and stats is default to 0', () => {
    const getRecords = expect.any(Function);
    const { result } = renderHook(() => useUserSessions(mockUserId));

    expect(result.current).toMatchObject({
      getRecords,
      loading: true,
      stats: {
        averageSession: 0,
        longestSession: 0,
        numberSessions: 0,
        totalSession: 0
      }
    });
  });

  test('Data is fetched first time and user has no sessions', async () => {
    localStorage.clear();

    mockFirebase({
      user: {
        uid: mockUserId,
        displayName: 'Darth Vader'
      },
      collections: {
        [`users/${mockUserId}/sessions`]: []
      }
    });

    const getRecords = expect.any(Function);

    const { result, waitForNextUpdate } = renderHook(() =>
      useUserSessions(mockUserId)
    );

    await waitForNextUpdate();

    expect(result.current).toMatchObject({
      getRecords,
      loading: false,
      stats: {
        averageSession: 0,
        longestSession: 0,
        numberSessions: 0,
        totalSession: 0
      }
    });
  });

  test('Data is fetched first time and user has sessions', async () => {
    localStorage.clear();

    const getRecords = expect.any(Function);

    const { result, waitForNextUpdate } = renderHook(() =>
      useUserSessions(mockUserId)
    );

    await waitForNextUpdate();

    expect(result.current).toMatchObject({
      getRecords,
      loading: false,
      stats: {
        averageSession: 0.20833333333333334,
        longestSession: 0.3333333333333333,
        numberSessions: 4,
        totalSession: 50
      }
    });
  });

  test('Data has been fetched before, stored in local storage and no new session', async () => {
    localStorage.clear();

    mockFirebase({
      user: {
        uid: mockUserId,
        displayName: 'Darth Vader'
      },
      collections: {
        [`users/${mockUserId}/sessions`]: []
      }
    });

    localStorage.setItem(storageKey1, '1003');
    localStorage.setItem(
      storageKey2,
      `{\"numberSessions\":4,\"averageSession\":0.20833333333333334,\"longestSession\":0.3333333333333333,\"totalSession\":50}`
    );

    const getRecords = expect.any(Function);

    const { result, waitForNextUpdate } = renderHook(() =>
      useUserSessions(mockUserId)
    );

    await waitForNextUpdate();

    expect(result.current).toMatchObject({
      getRecords,
      loading: false,
      stats: {
        averageSession: 0.20833333333333334,
        longestSession: 0.3333333333333333,
        numberSessions: 4,
        totalSession: 50
      }
    });
  });

  test('Data has been fetched before, stored in local storage and there is new session', async () => {
    localStorage.clear();

    mockFirebase({
      user: {
        uid: mockUserId,
        displayName: 'Darth Vader'
      },
      collections: {
        [`users/${mockUserId}/sessions`]: [
          {
            duration_in_seconds: 10,
            created_at: {
              epoch: 1004
            }
          }
        ]
      }
    });

    localStorage.setItem(`latest_session_timestamp_user_${mockUserId}`, '1002');
    localStorage.setItem(
      `stats_user_${mockUserId}`,
      `{\"numberSessions\":4,\"averageSession\":0.20833333333333334,\"longestSession\":0.3333333333333333,\"totalSession\":50}`
    );

    const getRecords = expect.any(Function);

    const { result, waitForNextUpdate } = renderHook(() =>
      useUserSessions(mockUserId)
    );

    await waitForNextUpdate();

    expect(result.current).toMatchObject({
      getRecords,
      loading: false,
      stats: {
        averageSession: 0.2,
        longestSession: 0.3333333333333333,
        numberSessions: 5,
        totalSession: 60
      }
    });
  });
});
