import { useState } from 'react';
import { joinGroup as groupsApiJoinGroup } from 'services/groups';

export function useGroupJoinMutation() {
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  async function joinGroup(
    id: string
  ): Promise<{ error?: string; success: boolean }> {
    setError(undefined);
    setLoading(true);
    try {
      await groupsApiJoinGroup(id);
      setLoading(false);
      return { success: true, error: undefined };
    } catch (e) {
      setError(e);
      setLoading(false);
      return { success: false, error };
    }
  }

  return {
    joinGroup,
    loading,
    error
  };
}

export default {
  useGroupJoinMutation
};
