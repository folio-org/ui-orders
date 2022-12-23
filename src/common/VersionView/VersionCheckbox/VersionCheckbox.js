import PropTypes from 'prop-types';

import { Checkbox } from '@folio/stripes/components';

export const VersionCheckbox = ({
  marked,
  label,
  ...props
}) => {
  const checkboxLabel = marked ? <mark>{label}</mark> : label;

  return (
    <Checkbox
      disabled
      label={checkboxLabel}
      vertical
      {...props}
    />
  );
};

VersionCheckbox.propTypes = {
  marked: PropTypes.bool,
  label: PropTypes.node.isRequired,
};
