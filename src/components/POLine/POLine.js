import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { Tags } from '@folio/stripes-acq-components';

import { ORDER } from '../Utils/resources';
import {
  lineMutatorShape,
  orderRecordsMutatorShape,
} from '../Utils/mutators';

import POLineView from './POLineView';

class POLine extends Component {
  static manifest = Object.freeze({
    order: ORDER,
  });

  static propTypes = {
    showToast: PropTypes.func.isRequired,
    parentResources: PropTypes.object.isRequired,
    parentMutator: PropTypes.shape({
      query: PropTypes.object.isRequired,
      poLine: lineMutatorShape,
      records: orderRecordsMutatorShape,
    }).isRequired,
    poURL: PropTypes.string,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
        lineId: PropTypes.string,
      }),
    }).isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
  }

  state = {
    isTagsPaneOpened: false,
  }

  toggleTagsPane = () => this.setState(({ isTagsPaneOpened }) => ({ isTagsPaneOpened: !isTagsPaneOpened }));

  getOrder = () => get(this.props.resources, ['order', 'records', 0]);

  getLine = () => {
    const { match: { params: { lineId } } } = this.props;
    const order = this.getOrder();
    const lines = get(order, 'compositePoLines', []);

    return lines.find(u => u.id === lineId);
  }

  deleteLine = () => {
    const { parentMutator, poURL, showToast } = this.props;
    const line = this.getLine();
    const lineNumber = line.poLineNumber;

    parentMutator.poLine.DELETE(line)
      .then(() => {
        showToast('ui-orders.line.delete.success', 'success', { lineNumber });
        parentMutator.query.update({ _path: poURL });
      })
      .catch(() => {
        showToast('ui-orders.errors.lineWasNotDeleted', 'error');
      });
  };

  render() {
    const {
      parentMutator,
      parentResources,
    } = this.props;

    const order = this.getOrder();
    const line = this.getLine();
    const materialTypes = get(parentResources, ['materialTypes', 'records'], []);
    const locations = get(parentResources, 'locations.records', []);
    const vendors = get(parentResources, 'vendors.records', []);
    const funds = get(parentResources, 'fund.records', []);
    const poURL = this.props.poURL;

    return (
      <Fragment>
        <POLineView
          location={this.props.location}
          history={this.props.history}
          line={line}
          order={order}
          materialTypes={materialTypes}
          locations={locations}
          vendors={vendors}
          poURL={poURL}
          funds={funds}
          queryMutator={parentMutator.query}
          deleteLine={this.deleteLine}
          tagsToggle={this.toggleTagsPane}
        />
        {this.state.isTagsPaneOpened && (
          <Tags
            putMutator={parentMutator.poLine.PUT}
            recordObj={line}
            onClose={this.toggleTagsPane}
          />
        )}
      </Fragment>
    );
  }
}

export default POLine;
