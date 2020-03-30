import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  PaneMenu,
  Button,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

const OrdersListLastMenu = ({ search }) => {
  return (
    <IfPermission perm="ui-orders.order.create">
      <PaneMenu>
        <FormattedMessage id="stripes-smart-components.addNew">
          {ariaLabel => (
            <Button
              id="clickable-neworder"
              aria-label={ariaLabel}
              to={{
                pathname: '/orders/create',
                search,
              }}
              buttonStyle="primary"
              marginBottom0
            >
              <FormattedMessage id="stripes-smart-components.new" />
            </Button>
          )}
        </FormattedMessage>
      </PaneMenu>
    </IfPermission>
  );
};

OrdersListLastMenu.propTypes = {
  search: PropTypes.string.isRequired,
};

export default OrdersListLastMenu;
