import { useCallback, useReducer } from 'react';

type State = {
  [key: string]: string;
};

type Action =
  | {
      type: 'change';
      key: string;
      value: string;
    }
  | {
      type: 'reset';
      defaultValues: any;
    };

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'change':
      return {
        ...state,
        [action.key]: action.value
      };
    case 'reset':
      return action.defaultValues;
  }
}

export const useForm = (defaultValues: State) => {
  const [currentInputs, dispatch] = useReducer(reducer, defaultValues);
  const handleInputChanges = useCallback(
    (e, name = undefined, value = undefined) => {
      dispatch({
        type: 'change',
        key: name || e.target.name,
        value: value || e.value || e.target.value
      });
    },
    [dispatch]
  );

  const handleReset = useCallback(
    e => {
      dispatch({
        type: 'reset',
        defaultValues
      });
    },
    [dispatch, defaultValues]
  );
  return {
    currentInputs,
    handleInputChanges,
    handleReset
  };
};
