import React from 'react';
import { FormattedMessage } from 'react-intl';

const NAME_REGEXP = new RegExp(/[^a-zA-Z\d]/);

export const validatePrefixSuffixName = ({ name }) => ({
  name: name?.match(NAME_REGEXP)
    ? <FormattedMessage id="ui-orders.settings.poNumber.nameValidation" />
    : undefined,
});
