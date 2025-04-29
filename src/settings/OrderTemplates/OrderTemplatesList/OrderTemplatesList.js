import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { useHistory } from 'react-router';

import {
  IfPermission,
  TitleManager,
  useStripes,
} from '@folio/stripes/core';
import {
  Button,
  NavList,
  NavListItem,
  Pane,
  HasCommand,
  checkScope,
} from '@folio/stripes/components';
import {
  handleKeyCommand,
  usePaneFocus,
} from '@folio/stripes-acq-components';

const OrderTemplatesList = ({ label, rootPath, orderTemplatesList = [] }) => {
  const intl = useIntl();
  const { paneTitleRef } = usePaneFocus();
  const stripes = useStripes();
  const history = useHistory();

  const lastMenu = useMemo(() => (
    <IfPermission perm="ui-orders.settings.order-templates.create">
      <Button
        to={`${rootPath}/create`}
        buttonStyle="primary paneHeaderNewButton"
        marginBottom0
      >
        <FormattedMessage id="ui-orders.settings.newBtn" />
      </Button>
    </IfPermission>
  ), [rootPath]);

  const shortcuts = [
    {
      name: 'new',
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('ui-orders.settings.order-templates.create')) {
          history.push(`${rootPath}/create`);
        }
      }),
    },
  ];

  return (
    <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.orderTemplates' })}>
      <HasCommand
        commands={shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
      >
        <Pane
          id="order-settings-order-templates-list"
          lastMenu={lastMenu}
          paneTitle={label}
          paneTitleRef={paneTitleRef}
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
      </HasCommand>
    </TitleManager>
  );
};

OrderTemplatesList.propTypes = {
  label: PropTypes.object.isRequired,
  orderTemplatesList: PropTypes.arrayOf(PropTypes.object),
  rootPath: PropTypes.string.isRequired,
};

export default OrderTemplatesList;
