import {
  RESET_PLAYERS,
  TO_PLAY,
  TO_PAUSE,
  SET_CURRENT_TRACK_INDEX,
  SET_CURRENT_TRACK_POSITION,
  SET_CURRENT_TRACK_SPEED,
  SET_CURRENT_TRACK_VOLUME,
  SET_COMMON_VOLUME,
} from '../actions/actionsTypes';
import { ConstantsList } from '../../common/constatns';

let initialState = {
  commonVolume: 100,
};

for (let i of ConstantsList.PLAYERS) {
  initialState = Object.assign(initialState, {
    [i.id]: {
      currentTrackIndex: 0,
      isPlaying: false,
      currentTrackPosition: 0,
      currentTrackSpeed: 1,
      currentTrackVolume: 100,
    }
  });
}

export default (state = initialState, action) => {
  const { type, payload, playerId, } = action;

  switch (type) {
    case SET_CURRENT_TRACK_INDEX:
      return {
        ...state,
        [playerId]: Object.assign({}, state[playerId], { currentTrackIndex: payload }),
      };

    case RESET_PLAYERS:
      return {
        ...initialState,
      };

    case TO_PLAY:
      return {
        ...state,
        [playerId]: Object.assign({}, state[playerId], { isPlaying: true }),
      };

    case TO_PAUSE:
      return {
        ...state,
        [playerId]: Object.assign({}, state[playerId], { isPlaying: false }),
      };

    case SET_CURRENT_TRACK_POSITION:
      return {
        ...state,
        [playerId]: Object.assign({}, state[playerId], { currentTrackPosition: payload }),
      };

    case SET_CURRENT_TRACK_SPEED:
      return {
        ...state,
        [playerId]: Object.assign({}, state[playerId], { currentTrackSpeed: payload }),
      };

    case SET_CURRENT_TRACK_VOLUME:
      return {
        ...state,
        [playerId]: Object.assign({}, state[playerId], { currentTrackVolume: payload }),
      };

    case SET_COMMON_VOLUME:
      console.log('reducer', payload);
      return {
        ...state,
        commonVolume: payload,
      };

    default: return state;
  }
};
