import PropTypes from 'prop-types';

import { FieldOrganization } from '@folio/stripes-acq-components';

import { POL_FORM_FIELDS } from '../../constants';

const styles = {
  wrapper: {
    width: '100%',
  },
};

const FieldAccessProvider = ({
  accessProviderId,
  disabled = false,
  required = false,
  ...props
}) => {
  return (
    <div style={styles.wrapper}>
      <FieldOrganization
        disabled={disabled}
        id={accessProviderId}
        labelId="ui-orders.eresource.accessProvider"
        name={POL_FORM_FIELDS.eresourceAccessProvider}
        required={required}
        {...props}
      />
    </div>
  );
};

FieldAccessProvider.propTypes = {
  accessProviderId: PropTypes.string,
  change: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

export default FieldAccessProvider;
