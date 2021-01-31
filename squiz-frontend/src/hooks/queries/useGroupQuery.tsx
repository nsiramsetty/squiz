import { getGroup, GroupSummary } from 'services/groups';
import { isPrivate as checkIsPrivate } from 'services/groups/helpers';
import { useQuery } from '../useQuery';

export function useGroupQuery(groupId?: string) {
  const { data: group, loading, loadData } = useQuery<GroupSummary>(
    groupId,
    getGroup
  );

  return {
    group,
    isPrivate: checkIsPrivate(group),
    loading,
    loadData
  };
}

export default {
  useGroupQuery
};
