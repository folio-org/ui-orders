import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

function EditionView({ value }) {
  return (
    <KeyValue
      label={<FormattedMessage id="ui-orders.itemDetails.edition" />}
      value={value || <NoValue />}
    />
  );
}

EditionView.propTypes = {
  value: PropTypes.string,
};

export default EditionView;
