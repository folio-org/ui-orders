import PropTypes from 'prop-types';
import { useContext } from 'react';

import { KeyValue } from '@folio/stripes/components';
import { VersionViewContext } from '@folio/stripes-acq-components';

export const VersionKeyValue = ({
  children,
  label,
  name,
  value,
}) => {
  const versionContext = useContext(VersionViewContext);
  const isUpdated = versionContext?.paths?.includes(name);

  const content = children || value;
  const displayValue = isUpdated ? <mark>{content}</mark> : content;

  return (
    <KeyValue
      label={label}
      value={displayValue}
    />
  );
};

VersionKeyValue.defaultProps = {
  marked: false,
};

VersionKeyValue.propTypes = {
  children: PropTypes.node,
  label: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.node,
};
