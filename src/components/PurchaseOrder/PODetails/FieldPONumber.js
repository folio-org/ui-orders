import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes-acq-components';

import { PO_FORM_FIELDS } from '../../../common/constants';

export const FieldPONumber = ({
  onBlur,
  validate,
}) => {
  const renderInput = useCallback(({ input, ...renderProps }) => {
    const handleBlur = (e) => {
      input?.onBlur?.(e);
      onBlur?.(e);
    };

    return (
      <TextField
        {...renderProps}
        input={input}
        onBlur={handleBlur}
      />
    );
  }, [onBlur]);

  return (
    <Field
      data-test-po-number
      fullWidth
      label={<FormattedMessage id="ui-orders.orderDetails.poNumber" />}
      name={PO_FORM_FIELDS.poNumber}
      validate={validate}
      validateFields={[]}
    >
      {renderInput}
    </Field>
  );
};

FieldPONumber.propTypes = {
  onBlur: PropTypes.func,
  validate: PropTypes.func,
};
