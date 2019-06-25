import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { get } from 'lodash';

import {
  Button,
  NavList,
  NavListItem,
  Pane,
} from '@folio/stripes/components';

import { ORDER_TEMPLATES } from '../../../components/Utils/resources';
import { getOrderTemplatesList } from '../util';

class OrderTemplatesList extends Component {
  static manifest = Object.freeze({
    orderTemplates: ORDER_TEMPLATES,
  });

  static propTypes = {
    label: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    rootPath: PropTypes.string.isRequired,
  };

  render() {
    const { label, rootPath, resources } = this.props;

    const orderTemplatesList = getOrderTemplatesList(get(resources, ['orderTemplates', 'records'], []));
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
        defaultWidth="fill"
      >
        <NavList>
          {orderTemplatesList.map(template => (
            <NavListItem
              key={template.id}
              to={`${rootPath}/${template.id}/view`}
            >
              {template.title}
            </NavListItem>
          ))}
        </NavList>
      </Pane>
    );
  }
}

export default OrderTemplatesList;
