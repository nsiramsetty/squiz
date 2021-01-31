import { useQuery } from 'hooks/useQuery';
import { getGroupRelation, GroupRelation } from 'services/groups';

export function useGroupRelationQuery(groupId?: string) {
  const { data: groupRelation, loading, error, loadData } = useQuery<
    GroupRelation | undefined
  >(groupId, getGroupRelation);

  return {
    groupRelation,
    loading,
    error,
    loadData
  };
}

export default {
  useGroupRelationQuery
};
