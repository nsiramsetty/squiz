import { useCallback, useState } from 'react';
import { getTeacher, User } from 'services/teacher';

export function useTeacherQuery() {
  const [teacher, setTeacher] = useState<User | null>();

  const loadData = useCallback(
    async (teacherUsername?: string) => {
      if (teacherUsername != null) {
        try {
          const data = await getTeacher(teacherUsername);
          if (data != null) {
            setTeacher(data);
          }
        } catch (error) {
          console.warn(`getTeacher:${teacherUsername}`, error);
          setTeacher(null);
        }
      }
    },
    [setTeacher]
  );

  return {
    teacher,
    loadData
  };
}

export default {
  useTeacherQuery
};
