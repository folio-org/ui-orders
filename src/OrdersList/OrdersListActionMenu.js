import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Icon,
  MenuSection,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

const OrdersListActionMenu = ({ search, ordersCount, onToggle, toggleExportModal }) => {
  const intl = useIntl();

  return (
    <MenuSection id="orders-list-actions">
      <IfPermission perm="ui-orders.order.create">
        <Button
          id="clickable-neworder"
          buttonStyle="dropdownItem"
          data-test-button-new-order
          aria-label={intl.formatMessage({ id: 'stripes-smart-components.addNew' })}
          to={{
            pathname: '/orders/create',
            search,
          }}
        >
          <Icon size="small" icon="plus-sign">
            <FormattedMessage id="stripes-smart-components.new" />
          </Icon>
        </Button>
      </IfPermission>

      <IfPermission perm="ui-orders.order.exportCSV">
        <Button
          id="clickable-export-csv"
          buttonStyle="dropdownItem"
          data-test-button-new-order
          aria-label={intl.formatMessage({ id: 'ui-orders.button.exportCSV' })}
          onClick={() => {
            onToggle();
            toggleExportModal();
          }}
          disabled={!ordersCount}
        >
          <Icon size="small" icon="download">
            <FormattedMessage id="ui-orders.button.exportCSV" />
          </Icon>
        </Button>
      </IfPermission>
    </MenuSection>
  );
};

OrdersListActionMenu.propTypes = {
  search: PropTypes.string.isRequired,
  ordersCount: PropTypes.number.isRequired,
  onToggle: PropTypes.func.isRequired,
  toggleExportModal: PropTypes.func.isRequired,
};

export default OrdersListActionMenu;
