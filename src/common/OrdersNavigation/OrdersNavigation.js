import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Button,
  ButtonGroup,
} from '@folio/stripes/components';

const OrdersNavigation = ({
  history,
  isOrderLines = false,
  isOrders = false,
}) => {
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
  history: ReactRouterPropTypes.history.isRequired,
  isOrderLines: PropTypes.bool,
  isOrders: PropTypes.bool,
};

export default withRouter(OrdersNavigation);
