import { Checkbox } from '@folio/stripes/components';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const NAME_REGEXP = new RegExp(/[^a-zA-Z\d]|^.{8,}$/);

export const validatePrefixSuffixName = (props) => {
  const errors = {};
  const name = props?.name?.match(NAME_REGEXP)
    ? <FormattedMessage id="ui-orders.settings.poNumber.nameValidation" />
    : undefined;

  if (name != undefined) {
    errors['name'] = name;
  }
  return errors;
};

export const formatDeprecated = ({ deprecated }) => {
  return <Checkbox disabled checked={ deprecated }/>;
}

export const validateDuplicates = (intl, fieldNames = []) => (item, index, items) => {
  const results = fieldNames.reduce((acc, fieldName) => {
    const fieldValue = item[fieldName];
    const isDuplicates = items.some((i, idx) => i[fieldName] === fieldValue && idx !== index);

    if (isDuplicates) {
      acc[fieldName] = intl.formatMessage({ id: 'ui-orders.settings.orderTemplateCategories.validation.duplicates' });
    }

    return acc;
  }, {});

  return results;
};
