import { useCallback, useReducer } from 'react';

export enum Action {
  SET_PLAY,
  SET_MUTE,
  SET_DURATION,
  SET_LOADING,
  SET_SEEKING,
  SET_PLAYED_TIME,
  SET_VOLUME
}

interface ReducerState {
  isLoading: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  duration: number;
  playedTime: number;
}

type ReducerAction =
  | { type: Action.SET_PLAY; value: boolean }
  | { type: Action.SET_MUTE; value: boolean }
  | { type: Action.SET_LOADING; value: boolean }
  | { type: Action.SET_DURATION; value: number }
  | { type: Action.SET_PLAYED_TIME; value: number }
  | { type: Action.SET_VOLUME; value: number };

const initialState: ReducerState = {
  isLoading: true,
  isPlaying: false,
  isMuted: false,
  volume: 0.7,
  duration: 0,
  playedTime: 0
};

const reducer = (state: ReducerState, action: ReducerAction): ReducerState => {
  switch (action.type) {
    case Action.SET_PLAY:
      return { ...state, isPlaying: action.value };
    case Action.SET_MUTE:
      return { ...state, isMuted: action.value };
    case Action.SET_VOLUME:
      return {
        ...state,
        volume: action.value
      };
    case Action.SET_DURATION:
      return {
        ...state,
        duration: action.value
      };
    case Action.SET_LOADING:
      return { ...state, isLoading: action.value };
    case Action.SET_PLAYED_TIME:
      return {
        ...state,
        playedTime: action.value
      };
    default:
      return state;
  }
};

export default function useHlsPlayer(player: any) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const config = {
    file: {
      forceAudio: true,
      forceHLS: true,
      hlsVersion: '0.14.11',
      hlsOptions: {
        maxBufferLength: 60
      }
    }
  };

  const seekTo = useCallback(
    (value: number) => {
      if (player == null) return;

      player.seekTo(value);
    },
    [player]
  );

  return {
    config,
    state,
    dispatch,
    seekTo
  };
}
