import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Loader from 'react-loader-spinner';
import Slider from '@material-ui/lab/Slider';
import Icon from '@material-ui/core/Icon';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';

import { returnExistingTracksNumber } from '../../common/commonFunc';
import { ConstantsList } from '../../common/constatns';
import { loadFontAwesomeIcons } from '../../common/commonFunc';
import djImage from '../../img/dj_girl.jpg';
import './TracksPlayer.scss';

class TracksPlayer extends Component {
  //============= GET ICONS FOR MATERIAL UI RAECT =============//
  componentDidMount() {
    loadFontAwesomeIcons();
  }

  //============= RENDER TRACK DATA =============//
  renderCurrentTrackData() {
    const { tracksData, players, playerId, currentTrackIndex } = this.props;
    const existingTracksNumber = returnExistingTracksNumber(tracksData);

    return (
      <div>
        <div className="track__title">
          <p>{!!existingTracksNumber && tracksData[currentTrackIndex].track.name}</p>
          {players[playerId].isPlaying &&
            <Loader
              type="Audio"
              color="rgb(0, 44, 59)"
              height="40"
              width="50"
            />}
        </div>
        <p className="track__number">
          {existingTracksNumber
            ? `It's track #${currentTrackIndex + 1} of ${existingTracksNumber} track${existingTracksNumber > 1
              ? 's'
              : ''}`
            : `Player list is empty`}
        </p>
      </div>
    );
  }

  //============= CHANGE TRACK POSITION =============//
  changeCurrentTrackPosition = (event, value) => {
    const { tracksData, currentTrackIndex, playerId, setCurrentTrackPosition } = this.props;

    tracksData[currentTrackIndex].audio.currentTime = (value * tracksData[currentTrackIndex].audio.duration) / 100;
    setCurrentTrackPosition(playerId, value);
  }

  //============= CONVERT SEC TO MIN =============//
  // radix === 10 (can be 2-36)
  converterFromSecToMin = data =>
    `${parseInt(data / 60, 10)}:${((data % 60) < 10)
      ? '0' + parseInt(data % 60, 10)
      : parseInt(data % 60, 10)}`;

  //============= CHANGE TRACK SPEED =============//
  changeCurrentTrackSpeed = event => {
    const { tracksData, playerId, currentTrackIndex, setCurrentTrackSpeed } = this.props;

    tracksData[currentTrackIndex].audio.playbackRate = event.target.value;
    setCurrentTrackSpeed(playerId, event.target.value);
  }

  //============= TRACK FROM START =============//
  oneTrackFromStart = () => {
    const { players, playerId, currentTrackIndex, oneTrackToStartPosition, oneTrackPlay } = this.props;

    if (players[playerId].isPlaying) {
      oneTrackToStartPosition(playerId, currentTrackIndex);
      setTimeout(() => oneTrackPlay());
    } else {
      oneTrackToStartPosition(playerId, currentTrackIndex);
    }
  }

  render() {
    const {
      players,
      playerId,
      tracksData,
      currentTrackIndex,
      oneTrackPlay,
      oneTrackPause,
      switchTrack,
      changeCurrentTrackVolume,
    } = this.props;


    const existingTracksNumber = returnExistingTracksNumber(tracksData);
    const currentTrackPosition = players[playerId].currentTrackPosition;
    const currentTrackVolume = players[playerId].currentTrackVolume;

    return (
      <Fragment>
        <img className="track__img" src={djImage} alt="dj-girl" />
        {this.renderCurrentTrackData()}
        {!!existingTracksNumber &&
          <p className="track__current-position">
            <span>{this.converterFromSecToMin(currentTrackPosition * tracksData[currentTrackIndex].audio.duration * .01)}</span>
            <span>{this.converterFromSecToMin(tracksData[currentTrackIndex].audio.duration)}</span>
          </p>
        }
        <Slider
          className="slider"
          disabled={!existingTracksNumber}
          direction='horizontal'
          onChange={this.changeCurrentTrackPosition}
          max={100}
          min={0}
          step={1}
          value={currentTrackPosition}
        >
        </Slider>
        <div className="buttons-wrapper">
          <Button
            disabled={!existingTracksNumber || (currentTrackPosition < 0.01)}
            onClick={() => this.oneTrackFromStart()}
            className="button--circle"
          >
            <Icon className="fas fa-step-backward" />
          </Button>
          <Button
            disabled={existingTracksNumber < 2}
            onClick={() => switchTrack(playerId, 'previous')}
            className="button--circle"
          >
            <Icon className="fas fa-backward" />
          </Button>
          <Button
            disabled={!existingTracksNumber}
            onClick={() => oneTrackPlay()}
            className="button--circle"
          >
            <Icon className="fas fa-play" />
          </Button>
          <Button
            disabled={!existingTracksNumber}
            onClick={() => oneTrackPause()}
            className="button--circle"
          >
            <Icon className="fas fa-pause" />
          </Button>
          <Button
            disabled={existingTracksNumber < 2}
            onClick={() => switchTrack(playerId, 'next')}
            className="button--circle"
          >
            <Icon className="fas fa-forward" />
          </Button>
        </div>
        <div className="track-volume-speed-container">
          <div className="track-volume-speed-container__volume">
            <p className="track__current-volume">
              <span>Volume </span>
              <span>{`${Math.round(currentTrackVolume)}%`}</span>
            </p>
            <Slider
              className="slider"
              disabled={!existingTracksNumber}
              direction='horizontal'
              onChange={changeCurrentTrackVolume}
              max={100}
              min={0}
              value={currentTrackVolume}
            >
            </Slider>
          </div>
          <div className="track-volume-speed-container__speed">
            <p className="track__current-speed">Speed </p>
            <FormControl disabled={!existingTracksNumber}>
              <Select
                className="select"
                value={players[playerId].currentTrackSpeed}
                onChange={this.changeCurrentTrackSpeed}
                displayEmpty
                name="speed"
              >
                {ConstantsList.PLAYBACK_RATE_VALUES.map((el, index) =>
                  <MenuItem key={index} value={el}>{el}</MenuItem>)}
              </Select>
            </FormControl>
          </div>
        </div>
      </Fragment >
    );
  }
}

TracksPlayer.propTypes = {
  players: PropTypes.object.isRequired,
  playerId: PropTypes.number.isRequired,
  tracksData: PropTypes.array.isRequired,
  currentTrackIndex: PropTypes.number.isRequired,
  oneTrackPlay: PropTypes.func.isRequired,
  oneTrackPause: PropTypes.func.isRequired,
  switchTrack: PropTypes.func.isRequired,
  changeCurrentTrackVolume: PropTypes.func.isRequired,
  oneTrackToStartPosition: PropTypes.func.isRequired,
}

export default TracksPlayer;
