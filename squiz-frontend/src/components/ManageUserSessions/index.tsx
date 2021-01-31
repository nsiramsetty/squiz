import ManageUserSessionRecords from 'components/ManageUserSessionRecords';
import VerticalSpacing from 'components/VerticalSpacing';
import useUserSessions, { TRecord } from 'hooks/useUserSessions';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { CSVDownload } from 'react-csv';
import {
  StatsColumn,
  StatsLabel,
  StatsRow,
  StatsValue,
  StyledButton,
  StyledContainer
} from './styled';

type TProps = {
  userId?: string;
};

const ManageUserSesssions: React.FC<TProps> = ({ userId }) => {
  const [records, setRecords] = useState<TRecord[]>([]);
  const [downloadedRecords, setDownloadedRecords] = useState<TRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState<string | undefined>();
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [showRecords, setShowRecords] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [showMoreRecords, setShowMoreRecords] = useState(false);

  const { stats, loading, getRecords } = useUserSessions(userId);
  const {
    numberSessions,
    averageSession,
    longestSession,
    totalSession
  } = stats;

  const StyledLoading = loading ? 1 : 0;

  const handleRecords = (loadMore?: boolean) => {
    if (loadingRecords) return;

    setLoadingRecords(loadMore ? 'more' : 'first');

    getRecords(10).then(data => {
      setRecords(records.concat(data.records));
      setLoadingRecords(undefined);
      setShowMoreRecords(data.hasMore);
    });
  };

  const handleDonwloadRecords = () => {
    if (loadingDownload) return;

    if (downloadedRecords.length === 0) {
      setLoadingDownload(true);

      getRecords().then(data => {
        setDownloadedRecords(data.records);
        setShowDownload(true);
        setLoadingDownload(false);
      });
    } else {
      setShowDownload(true);
    }
  };

  const handleShowRecords = () => {
    if (loading) return;

    if (records.length === 0) handleRecords();

    setShowRecords(!showRecords);
  };

  useEffect(() => {
    if (!showDownload) return;

    setTimeout(() => {
      setShowDownload(false);
    }, 1000);
  }, [showDownload]);

  return (
    <StyledContainer>
      <StatsRow>
        <StatsColumn>
          <StatsValue loading={StyledLoading}>{numberSessions}</StatsValue>
          <StatsLabel loading={StyledLoading}>number of sessions</StatsLabel>
        </StatsColumn>

        <StatsColumn>
          <StatsValue loading={StyledLoading}>
            {averageSession > 0 ? averageSession.toFixed(1) : averageSession}
          </StatsValue>
          <StatsLabel loading={StyledLoading}>
            average session time (min)
          </StatsLabel>
        </StatsColumn>

        <StatsColumn>
          <StatsValue loading={StyledLoading}>
            {longestSession.toFixed(0)}
          </StatsValue>
          <StatsLabel loading={StyledLoading}>
            longest session time (min)
          </StatsLabel>
        </StatsColumn>

        <StatsColumn>
          <StatsValue loading={StyledLoading}>
            {moment()
              .startOf('day')
              .seconds(totalSession)
              .format('H:mm')}
          </StatsValue>
          <StatsLabel loading={StyledLoading}>
            total session time (hr:min)
          </StatsLabel>
        </StatsColumn>
      </StatsRow>

      <VerticalSpacing height={[40, 40, 40, 40]} />

      <StyledButton
        loading={StyledLoading}
        onClick={handleShowRecords}
        active={showRecords ? 1 : 0}
      >
        {showRecords ? 'Hide' : 'Show'} records
      </StyledButton>

      <StyledButton loading={StyledLoading} onClick={handleDonwloadRecords}>
        {loadingDownload ? 'Downloading...' : 'Download session data'}
      </StyledButton>

      {showDownload && <CSVDownload data={downloadedRecords} />}

      {showRecords && (
        <>
          <VerticalSpacing height={[20, 40, 40, 40]} />
          <ManageUserSessionRecords
            loadingStatus={loadingRecords}
            records={records}
            showMoreRecords={showMoreRecords}
            getMoreRecords={() => handleRecords(true)}
          />
        </>
      )}
    </StyledContainer>
  );
};

export default ManageUserSesssions;
