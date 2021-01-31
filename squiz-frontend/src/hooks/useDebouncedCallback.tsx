import { debounce } from 'helpers/utils';
import { useCallback } from 'react';

type TDelayParam = number;
type TCallbackParam = (value: string) => void;
type TCallbackFunc = (value: string) => void;

const useDebouncedCallback = (callback: TCallbackParam, delay: TDelayParam) => {
  const d = callback;
  const callbackfunc: TCallbackFunc = useCallback(debounce(d, delay), []);

  return [callbackfunc];
};

export default useDebouncedCallback;
