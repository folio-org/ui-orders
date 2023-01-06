import PropTypes from 'prop-types';
import { useContext } from 'react';

import { Checkbox } from '@folio/stripes/components';
import { VersionViewContext } from '@folio/stripes-acq-components';

export const VersionCheckbox = ({
  checked,
  label,
  name,
  ...props
}) => {
  const versionContext = useContext(VersionViewContext);
  const isUpdated = versionContext?.paths?.includes(name);

  const checkboxLabel = isUpdated ? <mark>{label}</mark> : label;

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

VersionCheckbox.defaultProps = {
  checked: false,
  marked: false,
};

VersionCheckbox.propTypes = {
  checked: PropTypes.bool,
  label: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
};
