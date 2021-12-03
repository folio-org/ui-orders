import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  FieldSelectionFinal,
  useAcqMethodsOptions,
} from '@folio/stripes-acq-components';

import { useAcqMethods } from '../../hooks/useAcqMethods';

const FieldAcquisitionMethod = ({ disabled, required }) => {
  const { acqMethods } = useAcqMethods();
  const acquisitionMethods = useAcqMethodsOptions(acqMethods);

  return (
    <FieldSelectionFinal
      id="acquisition-method"
      dataOptions={acquisitionMethods}
      label={<FormattedMessage id="ui-orders.poLine.acquisitionMethod" />}
      name="acquisitionMethod"
      required={required}
      isNonInteractive={disabled}
    />
  );
};

FieldAcquisitionMethod.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

FieldAcquisitionMethod.defaultProps = {
  disabled: false,
  required: true,
};

export default FieldAcquisitionMethod;
