import {
  TRACKS_UPLOAD_START,
  TRACKS_UPLOAD_END,
  DELETE_TRACK,
  RESET_PLAYERS,
  TO_PLAY,
  TO_PAUSE,
  SET_CURRENT_TRACK_INDEX,
  SET_CURRENT_TRACK_POSITION,
  SET_CURRENT_TRACK_SPEED,
  SET_CURRENT_TRACK_VOLUME,
  SET_COMMON_VOLUME,
} from './actionsTypes';

export const tracksUploadStart = playerId => (
  {
    type: TRACKS_UPLOAD_START,
    playerId,
  }
);

export const tracksUploadEnd = (playerId, tracksList) => (
  {
    type: TRACKS_UPLOAD_END,
    payload: tracksList,
    playerId,
  }
);

export const deleteTrack = (playerId, trackIndex) => (
  {
    type: DELETE_TRACK,
    payload: trackIndex,
    playerId,
  }
);

export const setCurrentTrackIndex = (playerId, index) => {
  return (
    {
      type: SET_CURRENT_TRACK_INDEX,
      payload: index,
      playerId,
    })
};

export const resetPlayers = () => (
  {
    type: RESET_PLAYERS,
  }
);

export const toPlay = (playerId) => (
  {
    type: TO_PLAY,
    playerId,
  }
);

export const toPause = (playerId) => (
  {
    type: TO_PAUSE,
    playerId,
  }
);

export const setCurrentTrackPosition = (playerId, valueFromSlider) => (
  {
    type: SET_CURRENT_TRACK_POSITION,
    payload: valueFromSlider,
    playerId,
  }
);

export const setCurrentTrackSpeed = (playerId, valueFromSlider) => (
  {
    type: SET_CURRENT_TRACK_SPEED,
    payload: valueFromSlider,
    playerId,
  }
);

export const setCurrentTrackVolume = (playerId, valueFromSlider) => (
  {
    type: SET_CURRENT_TRACK_VOLUME,
    payload: valueFromSlider,
    playerId,
  }
);

export const setCommonVolume = (valueFromSlider) => (
  {
    type: SET_COMMON_VOLUME,
    payload: valueFromSlider,
  }
);
