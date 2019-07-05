import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  ButtonGroup,
  Button,
} from '@folio/stripes/components';

const goTo = (queryMutator, _path, sort = '') => {
  queryMutator.replace({
    _path,
    filters: '',
    sort,
  });
};

const OrdersNavigation = ({ isOrders, isOrderLines, queryMutator }) => (
  <ButtonGroup
    fullWidth
    data-test-orders-navigation
  >
    <Button
      onClick={() => goTo(queryMutator, '/orders', '-poNumber')}
      buttonStyle={`${isOrders ? 'primary' : 'default'}`}
    >
      <FormattedMessage id="ui-orders.navigation.orders" />
    </Button>
    <Button
      onClick={() => goTo(queryMutator, '/orders/lines', '-poLineNumber')}
      buttonStyle={`${isOrderLines ? 'primary' : 'default'}`}
      data-test-orders-navigation-lines
    >
      <FormattedMessage id="ui-orders.navigation.orderLines" />
    </Button>
  </ButtonGroup>
);

OrdersNavigation.propTypes = {
  isOrders: PropTypes.bool,
  isOrderLines: PropTypes.bool,
  queryMutator: PropTypes.object,
};

OrdersNavigation.defaultProps = {
  isOrders: false,
  isOrderLines: false,
};

export default OrdersNavigation;
