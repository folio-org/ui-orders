import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

import { RolloverAdjustmentAmount } from './RolloverAdjustmentAmount';

export const FieldRolloverAdjustmentAmount = ({
  name,
  ...props
}) => {
  const renderField = (renderProps) => {
    return (
      <RolloverAdjustmentAmount
        amount={renderProps.input.value}
        {...props}
      />
    );
  };

  return (
    <Field
      name={name}
      render={renderField}
    />
  );
};

FieldRolloverAdjustmentAmount.propTypes = {
  name: PropTypes.string.isRequired,
};
