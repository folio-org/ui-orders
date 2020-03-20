import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  ButtonGroup,
  Button,
} from '@folio/stripes/components';

const OrdersNavigation = ({ isOrders, isOrderLines, history }) => {
  const goTo = useCallback(
    (tabId, search) => history.push({
      pathname: tabId,
      search,
    }),
    [history],
  );

  return (
    <ButtonGroup
      fullWidth
      data-test-orders-navigation
    >
      <Button
        onClick={() => goTo('/orders', '')} // sorting=poNumber&sortingDirection=descending
        buttonStyle={`${isOrders ? 'primary' : 'default'}`}
      >
        <FormattedMessage id="ui-orders.navigation.orders" />
      </Button>
      <Button
        onClick={() => goTo('/orders/lines', '')}
        buttonStyle={`${isOrderLines ? 'primary' : 'default'}`}
        data-test-orders-navigation-lines
      >
        <FormattedMessage id="ui-orders.navigation.orderLines" />
      </Button>
    </ButtonGroup>
  );
};

OrdersNavigation.propTypes = {
  isOrders: PropTypes.bool,
  isOrderLines: PropTypes.bool,
  history: ReactRouterPropTypes.history.isRequired,
};

OrdersNavigation.defaultProps = {
  isOrders: false,
  isOrderLines: false,
};

export default withRouter(OrdersNavigation);
