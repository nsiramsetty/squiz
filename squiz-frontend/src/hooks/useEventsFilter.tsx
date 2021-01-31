import { useReducer } from 'react';
import { Filter } from 'services/events';

export enum Action {
  SET_START_DATE_FROM,
  SET_START_DATE_TO,
  SET_CONTENT_TYPES
}

type ReducerAction =
  | {
      type: Action.SET_START_DATE_FROM;
      value: number | undefined;
    }
  | {
      type: Action.SET_START_DATE_TO;
      value: number | undefined;
    }
  | {
      type: Action.SET_CONTENT_TYPES;
      value: string;
    };

const initialState: Filter = {};

const reducer = (state: Filter, action: ReducerAction): Filter => {
  switch (action.type) {
    case Action.SET_START_DATE_FROM:
      return {
        ...state,
        start_date_from: action.value
      };
    case Action.SET_START_DATE_TO:
      return {
        ...state,
        start_date_to: action.value
      };
    case Action.SET_CONTENT_TYPES:
      return {
        ...state,
        content_types: action.value
      };
    default:
      return state;
  }
};

export default function useEventsFilter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return {
    state,
    dispatch
  };
}
