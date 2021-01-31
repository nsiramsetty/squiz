import { useQuery } from 'hooks/useQuery';
import { getInvitations, GroupRelation } from 'services/groups';

export function useGroupInvitationsQuery() {
  const { data: invitations, error, loadData } = useQuery<GroupRelation[]>(
    'invitations',
    getInvitations
  );

  return {
    invitations,
    error,
    loadData
  };
}

export default {
  useGroupInvitationsQuery
};
