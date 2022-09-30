import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Button } from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

export const ReexportActionButton = ({
  id,
  disabled,
  onClick,
}) => {
  return (
    <IfPermission perm="orders.po-lines.item.put">
      <Button
        data-testid={id}
        id={id}
        buttonStyle="dropdownItem"
        disabled={disabled}
        onClick={onClick}
      >
        <FormattedMessage id="ui-orders.button.reexport" />
      </Button>
    </IfPermission>
  );
};

ReexportActionButton.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
