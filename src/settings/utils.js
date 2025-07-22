import { Checkbox } from '@folio/stripes/components';
import React from 'react';
import { 
  FormattedMessage,
  useIntl,
} from 'react-intl';

const NAME_REGEXP = new RegExp(/[^a-zA-Z\d]|^.{8,}$/);

export const validatePrefixName = ({ name }) => {
  return validateName(name);
};

export const validateSuffixName = ({ name }) => {
  return validateName(name);
};

export const validateName = (name) => {
  if (!name?.match(NAME_REGEXP)) return {};

  return {
    name: <FormattedMessage id='ui-orders.settings.poNumber.nameValidation' />,
  };
};

export const formatPrefixDeprecated = ({ name, deprecated }) => (
  <DeprecatedCheckbox
    name={name}
    deprecated={deprecated}
    messageId='ui-orders.settings.poNumber.prefix.aria-label.deprecated'
  />
);

export const formatSuffixDeprecated = ({ name, deprecated }) => (
  <DeprecatedCheckbox
    name={name}
    deprecated={deprecated}
    messageId='ui-orders.settings.poNumber.suffix.aria-label.deprecated'
  />
);

const DeprecatedCheckbox = ({ name, deprecated, messageId }) => {
  const intl = useIntl();

  return (
    <Checkbox
      aria-label={intl.formatMessage(
        { id: messageId },
        { name }
      )}
      disabled
      checked={deprecated}
    />
  );
};

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
