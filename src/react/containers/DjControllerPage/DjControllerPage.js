import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/lab/Slider';
import Paper from '@material-ui/core/Paper';

import TracksPlayer from '../../components/TracksPlayer';
import {
  resetPlayers,
  toPlay,
  toPause,
  setCurrentTrackIndex,
  setCurrentTrackPosition,
  setCurrentTrackSpeed,
  setCurrentTrackVolume,
  setCommonVolume,
} from '../../../redux/actions/actionsCreators';
import { ConstantsList } from '../../../common/constatns';
import { returnExistingTracksNumber, loadFontAwesomeIcons } from '../../../common/commonFunc';
import './DjControllerPage.scss';

class DjControllerPage extends Component {
  //============= GET ICONS FOR MATERIAL UI RAECT =============//
  componentDidMount() {
    loadFontAwesomeIcons();
  }

  //============= RESET PLAYERS =============//
  componentWillUnmount() {
    this.allTracksToStartPosition();
    this.props.resetPlayers();
  }

  switchToUploadPage() {
    this.props.history.push(ConstantsList.UPLOAD_PAGE_ROUTE);
  }

  //============= SWITCH TRACK =============//
  switchTrack = (playerId, side) => {
    const { tracks, players, setCurrentTrackIndex } = this.props;
    const tracksData = tracks[playerId].data;
    const currentTrackIndex = players[playerId].currentTrackIndex;

    this.oneTrackToStartPosition(playerId, currentTrackIndex);

    let newCurrentTrackIndex = currentTrackIndex;
    let maxIndex = tracksData.length;

    if (maxIndex > 1) {
      if (side.includes('next')) {
        newCurrentTrackIndex = newCurrentTrackIndex < maxIndex - 1
          ? (newCurrentTrackIndex + 1)
          : 0;
      }

      if (side.includes('previous')) {
        newCurrentTrackIndex = newCurrentTrackIndex > 0
          ? (newCurrentTrackIndex - 1)
          : (maxIndex - 1);
      }
    }

    setCurrentTrackIndex(playerId, newCurrentTrackIndex);
    // https://github.com/reduxjs/react-redux/issues/291
    // In React, state changes (and Reacf Redux uses setState internally) are potentially asynchronous. 
    // Because React batches update that happen during the same event handler.
    // Calling dispatch will update the store state immediately but components will be updated a bit later during.

    if (players[playerId].isPlaying) {
      setTimeout(() => this.oneTrackPlay(playerId, newCurrentTrackIndex));
    }
  }

  //============= PLAY TRACK =============//
  oneTrackPlay(playerId, currentTrackIndex) {
    const { tracks, players, toPlay, setCurrentTrackPosition } = this.props;

    if (returnExistingTracksNumber(tracks[playerId].data) > 0 && !players[playerId].isPlaying) {
      const currentTrack = tracks[playerId].data[currentTrackIndex].audio;

      this[`${playerId}currentTimeInterval`] = setInterval(() => {
        const self = this;

        setCurrentTrackPosition(playerId, (currentTrack.currentTime * 100) / currentTrack.duration);

        if (Math.floor(self.props.players[playerId].currentTrackPosition) === 100) {
          this.switchTrack(playerId, 'next');
        }
      }, 500);

      // initialize track
      currentTrack.playbackRate = players[playerId].currentTrackSpeed;
      currentTrack.volume = (players[playerId].currentTrackVolume / 100) * (players.commonVolume / 100);
      toPlay(playerId);
      currentTrack.play();
    }
  }

  allTracksPlay() {
    ConstantsList.PLAYERS.forEach(player => {
      this.oneTrackPlay(player.id, this.props.players[player.id].currentTrackIndex);
    });
  }

  //============= PAUSE TRACK =============//
  oneTrackPause(playerId, currentTrackIndex) {
    const { tracks, players, toPause } = this.props;
    if (returnExistingTracksNumber(tracks[playerId].data) > 0 && players[playerId].isPlaying) {
      const currentTrack = tracks[playerId].data[currentTrackIndex].audio;

      currentTrack.pause();
      toPause(playerId);
      clearInterval(this[`${playerId}currentTimeInterval`]);
    }
  }

  allTracksPause() {
    ConstantsList.PLAYERS.forEach(player => {
      this.oneTrackPause(player.id, this.props.players[player.id].currentTrackIndex);
    });
  }

  //============= TRACK TO START POSITION =============//
  oneTrackToStartPosition = (playerId, currentTrackIndex) => {
    const { tracks, setCurrentTrackPosition } = this.props;

    this.oneTrackPause(playerId, currentTrackIndex);

    if (returnExistingTracksNumber(tracks[playerId].data) > 0) {
      const currentTrack = tracks[playerId].data[currentTrackIndex].audio;

      if (currentTrack.currentTime !== 0) {
        currentTrack.currentTime = 0;
        setCurrentTrackPosition(playerId, 0);
      }
    }
  }

  allTracksToStartPosition() {
    ConstantsList.PLAYERS.forEach(player => {
      this.oneTrackToStartPosition(player.id, this.props.players[player.id].currentTrackIndex);
    });
  }

  //============= CHANGE TRACK VOLUME =============//
  changeOneTrackVolume(value, playerId) {
    const { tracks, players, setCurrentTrackVolume } = this.props;

    setCurrentTrackVolume(playerId, value);
    tracks[playerId].data[players[playerId].currentTrackIndex].audio.volume =
      (value / 100) * (players.commonVolume / 100);
  }

  changeCommonVolume(value) {
    const { tracks, players, setCommonVolume } = this.props;
    setCommonVolume(value);

    ConstantsList.PLAYERS.forEach(player => {
      if (players[player.id].isPlaying) {
        tracks[player.id].data[players[player.id].currentTrackIndex].audio.volume =
          (players[player.id].currentTrackVolume / 100) * (value / 100);
      }
    });
  }

  render() {
    const {
      tracks,
      players,
      setCurrentTrackPosition,
      setCurrentTrackSpeed,
    } = this.props;

    return (
      <Fragment>
        {
          ConstantsList.PLAYERS.map((player, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper className="paper">
                <TracksPlayer
                  key={index}
                  tracksData={tracks[player.id].data}
                  players={players}
                  playerId={player.id}
                  currentTrackIndex={players[player.id].currentTrackIndex}
                  oneTrackToStartPosition={this.oneTrackToStartPosition}
                  switchTrack={this.switchTrack}
                  setCurrentTrackPosition={setCurrentTrackPosition}
                  setCurrentTrackSpeed={setCurrentTrackSpeed}
                  oneTrackPlay={() => this.oneTrackPlay(player.id, players[player.id].currentTrackIndex)}
                  oneTrackPause={() => this.oneTrackPause(player.id, players[player.id].currentTrackIndex)}
                  changeCurrentTrackVolume={(event, value) => this.changeOneTrackVolume(value, player.id)}
                />
              </Paper>
            </Grid>
          ))
        }
        <div className="common-controller-container">
          <div className="common-controller__buttons">
            <Button
              className="button--circle"
              onClick={() => this.allTracksPlay()}
            >
              <Icon className="fas fa-play" />
            </Button>
            <Button
              className="button--circle"
              onClick={() => this.allTracksPause()}
            >
              <Icon className="fas fa-pause" />
            </Button>
          </div>
          <div className="common-controller__slider">
            <p className="common-controller__volume">
              <span>Volume</span>
              <span>{`${Math.round(players.commonVolume)}%`}</span>
            </p>
            <Slider
              onChange={(event, value) => this.changeCommonVolume(value)}
              max={100}
              min={0}
              value={players.commonVolume}
            >
            </Slider>
          </div>
        </div>
        <div className="button-wrap">
          <Button
            className="button--link pulse"
            variant="contained"
            color="primary"
            onClick={() => this.switchToUploadPage()}
          >
            <Icon className="fas fa-chevron-left" />
            to upload page
        </Button>
        </div>
      </Fragment >
    );
  }
}

const mapStateToProps = ({ tracks, players }) => (
  {
    tracks,
    players,
  }
);

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    resetPlayers,
    toPlay,
    toPause,
    setCurrentTrackIndex,
    setCurrentTrackPosition,
    setCurrentTrackSpeed,
    setCurrentTrackVolume,
    setCommonVolume,
  },
  dispatch);

DjControllerPage.propTypes = {
  tracks: PropTypes.object.isRequired,
  players: PropTypes.object.isRequired,
  resetPlayers: PropTypes.func.isRequired,
  toPlay: PropTypes.func.isRequired,
  toPause: PropTypes.func.isRequired,
  setCurrentTrackIndex: PropTypes.func.isRequired,
  setCurrentTrackPosition: PropTypes.func.isRequired,
  setCurrentTrackSpeed: PropTypes.func.isRequired,
  setCurrentTrackVolume: PropTypes.func.isRequired,
  setCommonVolume: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(DjControllerPage);
