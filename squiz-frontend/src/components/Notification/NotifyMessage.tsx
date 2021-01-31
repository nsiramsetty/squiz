import { useNotification } from 'hooks/useNotification';
import { useEffect } from 'react';

interface Props {
  id?: string;
}

const NotifyMessage: React.FC<Props> = ({ id, children }) => {
  const { setId, setMessage } = useNotification();

  useEffect(() => setMessage(children), [children, setMessage]);
  useEffect(() => setId(id), [id, setId]);

  return null;
};

export default NotifyMessage;
