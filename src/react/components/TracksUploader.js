import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import Icon from '@material-ui/core/Icon';
import Loader from 'react-loader-spinner';
import classNames from 'classnames';

import './TracksUploader.scss';

class TracksUploader extends Component {
  handleDrop(files) {
    const { tracks, tracksUploadStart, tracksUploadEnd, playerId } = this.props;
    const existTracks = tracks[playerId].data.map(item => item.track.name);
    const uniqueFiles = files.filter(el => existTracks.indexOf(el.name) === -1);

    // using Pomises, all operation in parallel
    const readerFile = file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const track = file;

        reader.onload = e => resolve(
          {
            track,
            audio: new Audio(e.target.result),
          }
        );

        reader.onerror = reader.onabort = () => reject(new Error("error"));
        reader.readAsDataURL(track);
      });
    }

    const readMultiFiles = () =>
      Promise.all(uniqueFiles.map(readerFile))
        .then(result => tracksUploadEnd(playerId, result), error => console.log(error));
    // OR using catch:
    // .then(result => tracksUploadEnd(playerId, result))
    // .catch(error => console.log(error));

    if (uniqueFiles.length) {
      tracksUploadStart(playerId);
      readMultiFiles();
    }

    // OR without using Promises, all operation also in parallel:
    // const tracksList = [];
    // let completed = 0;

    // uniqueFiles.forEach((file, index) => {
    //   const reader = new FileReader();
    //   const track = file;

    //   reader.onload = e => {
    //     tracksList[index] = {
    //       track,
    //       audio: new Audio(e.target.result)
    //     };

    //     completed++;

    //     if (completed === uniqueFiles.length) {
    //       tracksUploadEnd(playerId, tracksList);
    //     }
    //   }
    //   reader.readAsDataURL(track);
    // });
  }

  render() {
    const { tracks, playerId } = this.props;
    const tracksUploading = tracks[playerId].uploading;

    return (
      <div className="dropzone-wrapper">
        <Dropzone
          onDrop={this.handleDrop.bind(this)}
          accept="audio/*"
          disabled={tracksUploading}
        >
          <Icon
            className={classNames('icon-cloud-upload fas fa-cloud-upload-alt')}
            color="primary"
          />
          <p>Drag and drop</p>
          <p className="note-text">*only audio format</p>
          {tracksUploading && <div className="loader-container">
            <Loader
              type="Circles"
              color="#008000"
              height="100"
              width="100"
            />
          </div>
          }
        </Dropzone>
      </div>
    );
  }
}

TracksUploader.propTypes = {
  tracks: PropTypes.object.isRequired,
  playerId: PropTypes.number.isRequired,
}

export default TracksUploader;
