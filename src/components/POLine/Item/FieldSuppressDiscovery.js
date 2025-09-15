import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { useIntl } from 'react-intl';

import {
  Checkbox,
  InfoPopover,
} from '@folio/stripes/components';

import { POL_FORM_FIELDS } from '../../../common/constants';

export const FieldSuppressDiscovery = ({ disabled }) => {
  const intl = useIntl();

  const label = (
    <>
      {intl.formatMessage({ id: 'ui-orders.poLine.suppressFromDiscovery' })}
      <InfoPopover content={intl.formatMessage({ id: 'ui-orders.poLine.suppressFromDiscovery.tooltip' })} />
    </>
  );

  return (
    <Field
      id={POL_FORM_FIELDS.suppressInstanceFromDiscovery}
      component={Checkbox}
      disabled={disabled}
      fullWidth
      label={label}
      name={POL_FORM_FIELDS.suppressInstanceFromDiscovery}
      type="checkbox"
      validateFields={[]}
      vertical
    />
  );
};

FieldSuppressDiscovery.propTypes = {
  disabled: PropTypes.bool,
};
