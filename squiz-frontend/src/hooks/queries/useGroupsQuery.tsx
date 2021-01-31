import { useQuery } from 'hooks/useQuery';
import { getGroups, Group } from 'services/groups';

export function useGroupsQuery() {
  const { data: groups, loadData } = useQuery<Group[] | undefined>(
    'groups',
    getGroups
  );

  return {
    groups,
    loadData
  };
}

export default {
  useGroupsQuery
};
