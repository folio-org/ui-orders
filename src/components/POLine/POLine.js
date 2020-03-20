import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

import {
  CalloutContext,
  stripesConnect,
} from '@folio/stripes/core';
import {
  DICT_CONTRIBUTOR_NAME_TYPES,
  LINES_API,
  VENDORS_API,
  Tags,
} from '@folio/stripes-acq-components';

import {
  CONTRIBUTOR_NAME_TYPES,
  FUND,
  LOCATIONS,
  MATERIAL_TYPES,
  ORDER,
} from '../Utils/resources';
import {
  lineMutatorShape,
  orderRecordsMutatorShape,
} from '../Utils/mutators';

import POLineView from './POLineView';

class POLine extends Component {
  static contextType = CalloutContext;
  static manifest = Object.freeze({
    order: ORDER,
    [DICT_CONTRIBUTOR_NAME_TYPES]: CONTRIBUTOR_NAME_TYPES,
    poLine: {
      accumulate: true,
      fetch: false,
      path: LINES_API,
      perRequest: 1000,
      records: 'poLines',
      throwErrors: false,
      type: 'okapi',
    },
    vendors: {
      type: 'okapi',
      path: VENDORS_API,
      GET: {
        params: {
          query: 'id=="*" sortby name',
        },
      },
      records: 'organizations',
      perRequest: 1000,
    },
    fund: FUND,
    materialTypes: MATERIAL_TYPES,
    locations: {
      ...LOCATIONS,
      fetch: true,
    },
    query: {},
  });

  static propTypes = {
    mutator: PropTypes.shape({
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
    const { mutator, poURL } = this.props;
    const line = this.getLine();
    const lineNumber = line.poLineNumber;

    this.unmountDeleteOrderConfirm();
    mutator.poLine.DELETE(line)
      .then(() => {
        this.context.sendCallout({
          message: <SafeHTMLMessage id="ui-orders.line.delete.success" values={{ lineNumber }} />,
          type: 'success',
        });
        mutator.query.update({ _path: poURL });
      })
      .catch(async errorResponse => {
        this.context.sendCallout({
          message: <SafeHTMLMessage id="ui-orders.errors.lineWasNotDeleted" />,
          type: 'error',
        });

        let message = null;

        try {
          const response = await errorResponse.json();

          message = response.errors[0].message;
        // eslint-disable-next-line no-empty
        } catch (e) {}

        if (message) {
          this.context.sendCallout({
            message,
            timeout: 0,
            type: 'error',
          });
        }
      });
  };

  render() {
    const {
      mutator,
      resources,
    } = this.props;

    const order = this.getOrder();
    const line = this.getLine();
    const materialTypes = get(resources, ['materialTypes', 'records'], []);
    const locations = get(resources, 'locations.records', []);
    const funds = get(resources, 'fund.records', []);
    const poURL = this.props.poURL;

    return (
      <>
        <POLineView
          location={this.props.location}
          history={this.props.history}
          line={line}
          order={order}
          materialTypes={materialTypes}
          locations={locations}
          poURL={poURL}
          funds={funds}
          queryMutator={mutator.query}
          deleteLine={this.deleteLine}
          tagsToggle={this.toggleTagsPane}
        />
        {this.state.isTagsPaneOpened && (
          <Tags
            putMutator={mutator.poLine.PUT}
            recordObj={line}
            onClose={this.toggleTagsPane}
          />
        )}
      </>
    );
  }
}

export default stripesConnect(POLine);
