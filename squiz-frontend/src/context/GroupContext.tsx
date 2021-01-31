import { useGroupQuery } from 'hooks/queries/useGroupQuery';
import { useGroupRelationQuery } from 'hooks/queries/useGroupRelationQuery';
import React, { useCallback, useContext, useState } from 'react';
import { UserSummary } from 'services/courses';
import { GroupRelation, GroupSummary } from 'services/groups';
import { getGroupMembers } from 'services/groups/helpers';

interface Props {
  id?: string;
}

interface Context {
  id?: string;
  group?: GroupSummary;
  groupRelation?: GroupRelation;
  groupMembers: UserSummary[];
  isLoadingGroup: boolean;
  isLoadingGroupRelation: boolean;
  loadGroup: () => Promise<void>;
  loadGroupRelation: () => Promise<void>;
  setRequestToJoin: () => void;
  isRequestToJoin: boolean;
}

const initialState: Context = {
  id: undefined,
  group: undefined,
  groupRelation: undefined,
  groupMembers: [],
  isLoadingGroup: false,
  isLoadingGroupRelation: false,
  loadGroup: () => Promise.resolve(),
  loadGroupRelation: () => Promise.resolve(),
  setRequestToJoin: () => {},
  isRequestToJoin: false
};

export const GroupContext = React.createContext<Context>(initialState);

export const GroupProvider: React.FC<Props> = ({ id, children }) => {
  const { group, loading: isLoadingGroup, loadData: loadGroup } = useGroupQuery(
    id
  );
  const {
    groupRelation,
    loading: isLoadingGroupRelation,
    loadData: loadGroupRelation
  } = useGroupRelationQuery(id);
  const [isRequestToJoin, setIsRequestToJoin] = useState<boolean>(false);
  const setRequestToJoin = useCallback(() => setIsRequestToJoin(true), []);

  return (
    <GroupContext.Provider
      value={{
        id,
        group,
        groupRelation,
        groupMembers: getGroupMembers(group),
        isLoadingGroup,
        isLoadingGroupRelation,
        loadGroup,
        loadGroupRelation,
        setRequestToJoin,
        isRequestToJoin
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export const useGroupContext = () => useContext(GroupContext);
