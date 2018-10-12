import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, Switch } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

import UploadPage from './containers/UploadPage/UploadPage';
import DjControllerPage from './containers/DjControllerPage/DjControllerPage';
import { ConstantsList } from '../common/constatns';
import { checkExistingTracks } from '../common/commonFunc';
import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="main-wrapper">
        <Grid container spacing={24}>
          <Switch>
            <Route exact path={ConstantsList.UPLOAD_PAGE_ROUTE} component={UploadPage} />
            <Route exact path={ConstantsList.DJ_CONTROLLER_PAGE_ROUTE}
              render={props =>
                checkExistingTracks(this.props.store.getState())
                  ? (<DjControllerPage {...props} />)
                  : (<Redirect to={ConstantsList.UPLOAD_PAGE_ROUTE} />)
              }
            />
            <Redirect to={ConstantsList.UPLOAD_PAGE_ROUTE} />
          </Switch >
        </Grid>
      </div>
    );
  };
}

App.propTypes = {
  store: PropTypes.object.isRequired,
}

export default App;
