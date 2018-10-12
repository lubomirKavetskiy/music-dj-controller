import {
  TRACKS_UPLOAD_START,
  TRACKS_UPLOAD_END,
  DELETE_TRACK,
} from '../actions/actionsTypes';
import { ConstantsList } from '../../common/constatns';

const initialState = {};

for (let i of ConstantsList.PLAYERS) {
  initialState[i.id] = {
    uploading: false,
    data: [],
  }
}

export default (state = initialState, action) => {
  const { type, payload, playerId } = action;

  switch (type) {

    case TRACKS_UPLOAD_START:
      return {
        ...state,
        [playerId]: Object.assign({}, state[playerId], { uploading: true }),
      };

    case TRACKS_UPLOAD_END:
      return {
        ...state,
        [playerId]: {
          uploading: false,
          data: state[playerId].data.concat(payload),
        }
      };

    case DELETE_TRACK:
      return {
        ...state,
        [playerId]: Object.assign({}, state.playerId, {
          data: state[playerId].data.filter((el, ind, arr) => arr.indexOf(el) !== payload),
        })
      };

    default: return state;
  }
};
