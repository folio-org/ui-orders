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
  LOCATIONS,
  MATERIAL_TYPES,
  ORDER_TEMPLATE,
} from '../../../components/Utils/resources';
import OrderTemplateView from './OrderTemplateView';

class OrderTemplateViewContainer extends Component {
  static manifest = Object.freeze({
    addresses: ADDRESSES,
    locations: LOCATIONS,
    materialTypes: MATERIAL_TYPES,
    orderTemplate: ORDER_TEMPLATE,
  });

  static propTypes = {
    close: PropTypes.func.isRequired,
    mutator: PropTypes.object.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    rootPath: PropTypes.string.isRequired,
    showSuccessDeleteMessage: PropTypes.func.isRequired,
    resources: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.callout = React.createRef();
  }

  onDeleteOrderTemplate = async () => {
    const { close, mutator: { orderTemplate }, match: { params: { id } }, showSuccessDeleteMessage } = this.props;

    try {
      await orderTemplate.DELETE({ id });
      close();
      showSuccessDeleteMessage();
    } catch (e) {
      this.callout.current.sendCallout({
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
    const locations = get(resources, 'locations.records', []);
    const materialTypes = get(resources, 'materialTypes.records', []);

    return (
      <Fragment>
        <OrderTemplateView
          addresses={addresses}
          close={close}
          funds={funds}
          locations={locations}
          materialTypes={materialTypes}
          onDelete={this.onDeleteOrderTemplate}
          rootPath={rootPath}
          orderTemplate={orderTemplate}
        />
        <Callout ref={this.callout} />
      </Fragment>
    );
  }
}

export default OrderTemplateViewContainer;
