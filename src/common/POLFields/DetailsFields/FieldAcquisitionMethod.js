import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useField } from 'react-final-form';

import {
  FieldSelectionFinal,
  useAcqMethodsOptions,
} from '@folio/stripes-acq-components';

import { POL_FORM_FIELDS } from '../../constants';
import { useAcqMethods } from '../../hooks/useAcqMethods';

const FieldAcquisitionMethod = ({
  disabled = false,
  required = true,
  ...props
}) => {
  const { acqMethods } = useAcqMethods();
  // Read only the acquisition-method field value so this field re-renders when it changes,
  // rather than on every keystroke elsewhere in the form.
  const { input: { value: selectedValue } } = useField(POL_FORM_FIELDS.acquisitionMethod, {
    subscription: { value: true },
  });

  const acquisitionMethods = useAcqMethodsOptions(acqMethods, {
    excludeDeprecated: true,
    selectedValue,
    withDeprecatedSuffix: true,
  });

  return (
    <FieldSelectionFinal
      id="acquisition-method"
      dataOptions={acquisitionMethods}
      label={<FormattedMessage id="ui-orders.poLine.acquisitionMethod" />}
      name={POL_FORM_FIELDS.acquisitionMethod}
      required={required}
      isNonInteractive={disabled}
      {...props}
    />
  );
};

FieldAcquisitionMethod.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

export default FieldAcquisitionMethod;
