import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

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
  const acquisitionMethods = useAcqMethodsOptions(acqMethods);

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
