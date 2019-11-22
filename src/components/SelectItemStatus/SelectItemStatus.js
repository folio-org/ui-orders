import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Select } from '@folio/stripes/components';

import {
  ITEM_STATUS,
} from '../../common/constants';

import css from './SelectItemStatus.css';

// eslint-disable-next-line no-unused-vars
const SelectItemStatus = ({ isAssociatedRecord, ...rest }) => {
  const availableStatuses = [ITEM_STATUS.inProcess];

  return (
    <Select
      fullWidth
      selectClass={css.itemStatusField}
      marginBottom0
      {...rest}
    >
      {availableStatuses.map((key) => (
        <FormattedMessage
          id={`ui-orders.receiving.itemStatus.${key}`}
          key={key}
        >
          {(message) => <option value={key}>{message}</option>}
        </FormattedMessage>
      ))}
    </Select>
  );
};

SelectItemStatus.propTypes = {
  isAssociatedRecord: PropTypes.string,
};

export default SelectItemStatus;
