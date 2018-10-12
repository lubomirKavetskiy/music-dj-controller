import { ConstantsList } from './constatns';
import { loadCSS } from 'fg-loadcss/src/loadCSS';

export const checkExistingTracks = ({ tracks }) => {
  let result = false;
  for (let player of ConstantsList.PLAYERS) {
    if (tracks[player.id].data.length) {
      result = true;
      break;
    }
  }
  return result;
}

export const returnExistingTracksNumber = tracksData => tracksData.length;

export const loadFontAwesomeIcons = () => loadCSS(
  'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
  document.querySelector('#insertion-point-jss'),
);
