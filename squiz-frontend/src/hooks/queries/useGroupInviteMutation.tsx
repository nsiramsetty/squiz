import { useState } from 'react';
import { inviteUserToGroup } from 'services/groups';

export function useGroupInviteMutation() {
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  async function inviteUser(
    userId: string,
    circleId: string
  ): Promise<{ error?: string; success: boolean }> {
    setError(undefined);
    setLoading(true);
    try {
      await inviteUserToGroup(userId, circleId);
      setLoading(false);
      return { success: true, error };
    } catch (e) {
      setError(e);
      setLoading(false);
      return { success: false, error };
    }
  }

  return {
    inviteUser,
    loading,
    error
  };
}

export default {
  useGroupInviteMutation
};
