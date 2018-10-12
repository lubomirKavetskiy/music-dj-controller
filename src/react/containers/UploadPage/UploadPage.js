import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';

import TracksUploader from '../../components/TracksUploader';
import {
  tracksUploadStart,
  tracksUploadEnd,
  deleteTrack,
} from '../../../redux/actions/actionsCreators';
import { ConstantsList } from '../../../common/constatns';
import { checkExistingTracks, loadFontAwesomeIcons } from '../../../common/commonFunc';
import './UploadPage.scss';

const styles = theme => ({
  button: {
    borderRadius: 0,
  },
});

class UploadPage extends Component {
  //============= GET ICONS FOR MATERIAL UI RAECT =============//
  componentDidMount() {
    loadFontAwesomeIcons();
  }


  renderTracksList = playerId => {
    const { tracks, deleteTrack, classes } = this.props;
    return (
      <ul className="tracks-list">{tracks[playerId].data.map((item, index) =>
        <li key={index} className="tracks-list__item">
          <span className="tracks-list__title">{`${index + 1}. ${item.track.name}`}</span>
          <IconButton
            color="secondary"
            aria-label="Delete"
            className={`${classes.button} button--delete`}
            onClick={() => deleteTrack(playerId, index)}
          >
            <DeleteIcon />
          </IconButton>
        </li>)}
      </ul>
    );
  }

  swithToDjControllerPage() {
    checkExistingTracks(this.props) && this.props.history.push(ConstantsList.DJ_CONTROLLER_PAGE_ROUTE);
  }

  render() {
    const { tracks, tracksUploadStart, tracksUploadEnd, classes } = this.props;
    const existingTracks = checkExistingTracks(this.props);

    return (
      < Fragment >
        {
          ConstantsList.PLAYERS.map((player, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper className="paper">
                <TracksUploader
                  playerId={player.id}
                  tracks={tracks}
                  tracksUploadStart={tracksUploadStart}
                  tracksUploadEnd={tracksUploadEnd}
                />
                <span className="player__title">Player #{player.id}</span>
                {(tracks[player.id].data.length > 0)
                  &&
                  this.renderTracksList(player.id)
                }
              </Paper>
            </Grid>
          ))
        }
        <div className="button-wrap">
          <Button
            disabled={!existingTracks}
            onClick={() => this.swithToDjControllerPage()}
            className={
              `${classes.button &&
              (existingTracks ? 'pulse' : null)} button--link`
            }
            variant="contained"
            color="primary"
          >
            to dj controller
          <Icon className="fas fa-chevron-right" />
          </Button>
        </div>
      </Fragment >
    );
  }
}

UploadPage.propTypes = {
  tracks: PropTypes.object.isRequired,
  tracksUploadStart: PropTypes.func.isRequired,
  tracksUploadEnd: PropTypes.func.isRequired,
  deleteTrack: PropTypes.func.isRequired,
}

const mapStateToProps = state => (
  {
    tracks: state.tracks,
  }
);

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    tracksUploadStart,
    tracksUploadEnd,
    deleteTrack,
  },
  dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UploadPage));
