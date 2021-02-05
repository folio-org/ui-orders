import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { IfPermission } from '@folio/stripes/core';
import {
  Button,
  NavList,
  NavListItem,
  Pane,
} from '@folio/stripes/components';

class OrderTemplatesList extends Component {
  static propTypes = {
    label: PropTypes.object.isRequired,
    orderTemplatesList: PropTypes.arrayOf(PropTypes.object),
    rootPath: PropTypes.string.isRequired,
  };

  static defaultProps = {
    orderTemplatesList: [],
  };

  render() {
    const { label, rootPath, orderTemplatesList } = this.props;

    const lastMenu = (
      <IfPermission perm="ui-orders.settings.order-templates.create">
        <Button
          to={`${rootPath}/create`}
          buttonStyle="primary paneHeaderNewButton"
          marginBottom0
        >
          <FormattedMessage id="ui-orders.settings.newBtn" />
        </Button>
      </IfPermission>
    );

    return (
      <Pane
        id="order-settings-order-templates-list"
        lastMenu={lastMenu}
        paneTitle={label}
        defaultWidth="fill"
      >
        <NavList>
          {orderTemplatesList.map(template => (
            <NavListItem
              key={template.id}
              to={`${rootPath}/${template.id}/view`}
            >
              {template.templateName}
            </NavListItem>
          ))}
        </NavList>
      </Pane>
    );
  }
}

export default OrderTemplatesList;
