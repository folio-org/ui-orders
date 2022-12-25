import PropTypes from 'prop-types';

import { Checkbox } from '@folio/stripes/components';

export const VersionCheckbox = ({
  checked,
  marked,
  label,
  ...props
}) => {
  const checkboxLabel = marked ? <mark>{label}</mark> : label;

  return (
    <Checkbox
      checked={Boolean(checked)}
      disabled
      label={checkboxLabel}
      vertical
      {...props}
    />
  );
};

VersionCheckbox.propTypes = {
  checked: PropTypes.bool,
  marked: PropTypes.bool,
  label: PropTypes.node.isRequired,
};
