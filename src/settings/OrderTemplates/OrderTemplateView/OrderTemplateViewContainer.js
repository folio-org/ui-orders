import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import { get } from 'lodash';

import { Callout } from '@folio/stripes/components';

import {
  getAddresses,
} from '../../../common/utils';
import {
  ADDRESSES,
  CONTRIBUTOR_NAME_TYPES,
  IDENTIFIER_TYPES,
  LOCATIONS,
  MATERIAL_TYPES,
  ORDER_TEMPLATE,
  VENDORS,
  USERS,
} from '../../../components/Utils/resources';
import OrderTemplateView from './OrderTemplateView';

class OrderTemplateViewContainer extends Component {
  static manifest = Object.freeze({
    addresses: ADDRESSES,
    identifierTypes: IDENTIFIER_TYPES,
    contributorNameTypes: CONTRIBUTOR_NAME_TYPES,
    locations: LOCATIONS,
    materialTypes: MATERIAL_TYPES,
    orderTemplate: ORDER_TEMPLATE,
    vendors: VENDORS,
    users: USERS,
  });

  static propTypes = {
    close: PropTypes.func.isRequired,
    mutator: PropTypes.object.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    rootPath: PropTypes.string.isRequired,
    showSuccessDeleteMessage: PropTypes.func.isRequired,
    resources: PropTypes.object,
  };

  createCalloutRef = ref => {
    this.callout = ref;
  };

  onDeleteOrderTemplate = async () => {
    const { close, mutator: { orderTemplate }, match: { params: { id } }, showSuccessDeleteMessage } = this.props;

    try {
      await orderTemplate.DELETE({ id });
      close();
      showSuccessDeleteMessage();
    } catch (e) {
      this.callout.sendCallout({
        message: <FormattedMessage id="ui-orders.settings.orderTemplates.remove.error" />,
        type: 'error',
      });
    }
  };

  render() {
    const { close, resources, rootPath } = this.props;
    const orderTemplate = get(resources, ['orderTemplate', 'records', 0], {});
    const addresses = getAddresses(get(resources, 'addresses.records', []));
    const funds = get(resources, 'funds.records', []);
    const identifierTypes = get(resources, 'identifierTypes.records', []);
    const contributorNameTypes = get(resources, 'contributorNameTypes.records', []);
    const locations = get(resources, 'locations.records', []);
    const materialTypes = get(resources, 'materialTypes.records', []);
    const vendors = get(resources, 'vendors.records', []);
    const users = get(resources, 'users.records', []);

    return (
      <Fragment>
        <OrderTemplateView
          addresses={addresses}
          close={close}
          funds={funds}
          identifierTypes={identifierTypes}
          locations={locations}
          materialTypes={materialTypes}
          onDelete={this.onDeleteOrderTemplate}
          rootPath={rootPath}
          template={orderTemplate}
          vendors={vendors}
          users={users}
          contributorNameTypes={contributorNameTypes}
        />
        <Callout ref={this.createCalloutRef} />
      </Fragment>
    );
  }
}

export default OrderTemplateViewContainer;
