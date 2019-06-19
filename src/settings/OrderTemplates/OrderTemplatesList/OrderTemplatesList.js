import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Pane,
} from '@folio/stripes/components';

const OrderTemplatesList = ({ label, rootPath }) => {
  const lastMenu = (
    <Button
      to={`${rootPath}/create`}
      buttonStyle="primary paneHeaderNewButton"
      marginBottom0
    >
      <FormattedMessage id="ui-orders.settings.newBtn" />
    </Button>
  );

  return (
    <Pane
      id="order-settings-order-templates-list"
      lastMenu={lastMenu}
      paneTitle={label}
    />
  );
};

OrderTemplatesList.propTypes = {
  label: PropTypes.object.isRequired,
  rootPath: PropTypes.string.isRequired,
};

OrderTemplatesList.displayName = 'OrderTemplates';

export default OrderTemplatesList;
