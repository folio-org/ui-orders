import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import {
  get,
  find,
} from 'lodash';

import { Callout } from '@folio/stripes/components';

import {
  getAddresses,
} from '../../../common/utils';
import {
  ADDRESSES,
  FUND,
  IDENTIFIER_TYPES,
  LOCATIONS,
  MATERIAL_TYPES,
  ORDER_TEMPLATES,
  VENDORS,
} from '../../../components/Utils/resources';
import { getOrderTemplatesList } from '../util';
import OrderTemplateView from './OrderTemplateView';

class OrderTemplateViewContainer extends Component {
  static manifest = Object.freeze({
    addresses: ADDRESSES,
    funds: FUND,
    identifierTypes: IDENTIFIER_TYPES,
    locations: LOCATIONS,
    materialTypes: MATERIAL_TYPES,
    orderTemplates: ORDER_TEMPLATES,
    vendors: VENDORS,
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
    const { close, mutator: { orderTemplates }, match: { params: { id } }, showSuccessDeleteMessage } = this.props;

    try {
      await orderTemplates.DELETE({ id });
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
    const { close, match: { params: id }, resources, rootPath } = this.props;
    const orderTemplatesList = getOrderTemplatesList(get(resources, ['orderTemplates', 'records'], []));
    const orderTemplate = find(orderTemplatesList, id, {});
    const addresses = getAddresses(get(resources, 'addresses.records', []));
    const funds = get(resources, 'funds.records', []);
    const identifierTypes = get(resources, 'identifierTypes.records', []);
    const locations = get(resources, 'locations.records', []);
    const materialTypes = get(resources, 'materialTypes.records', []);
    const vendors = get(resources, 'vendors.records', []);

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
        />
        <Callout ref={this.createCalloutRef} />
      </Fragment>
    );
  }
}

export default OrderTemplateViewContainer;
