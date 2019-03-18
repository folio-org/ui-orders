import React, { Component } from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import queryString from 'query-string';

import {
  IfPermission,
  stripesShape,
} from '@folio/stripes/core';

import { PO } from '../PurchaseOrder';
import { POLine } from '../POLine';
import { LayerPOLine } from '../LayerCollection';

class Panes extends Component {
  static propTypes = {
    connectedSource: PropTypes.object.isRequired,
    editLink: PropTypes.string.isRequired,
    stripes: stripesShape.isRequired,
    parentMutator: PropTypes.object.isRequired,
    parentResources: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onCloseEdit: PropTypes.func.isRequired,
    tagsToggle: PropTypes.func.isRequired,
    paneWidth: PropTypes.string.isRequired,
    match: ReactRouterPropTypes.match,
    location: ReactRouterPropTypes.location,
  }

  constructor(props) {
    super(props);
    this.connectedPO = props.stripes.connect(PO);
    this.connectedPOLine = props.stripes.connect(POLine);
    this.connectedLayerPOLine = props.stripes.connect(LayerPOLine);
  }

  render() {
    const { location, match: { path, url }, onCloseEdit } = this.props;
    const { layer } = location.search ? queryString.parse(location.search) : {};

    return (
      <Switch>
        <Route
          exact
          path={path}
          render={
            props => {
              if (layer === 'create-po-line') {
                return (
                  <this.connectedLayerPOLine
                    {...this.props}
                    {...props}
                    onCancel={onCloseEdit}
                  />
                );
              }

              return (
                <this.connectedPO
                  {...this.props}
                  {...props}
                />
              );
            }
          }
        />
        <IfPermission perm="orders.po-lines.item.get">
          <Route
            exact
            path={`${path}/po-line/view/:lineId`}
            render={
              props => {
                if (layer === 'edit-po-line' || layer === 'create-po-line') {
                  return (
                    <this.connectedLayerPOLine
                      {...this.props}
                      {...props}
                      onCancel={onCloseEdit}
                    />
                  );
                }

                return (
                  <this.connectedPOLine
                    poURL={url}
                    {...this.props}
                    {...props}
                  />
                );
              }
            }
          />
        </IfPermission>
      </Switch>
    );
  }
}

export default Panes;
