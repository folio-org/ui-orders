import PropTypes from 'prop-types';

import { KeyValue } from '@folio/stripes/components';

export const VersionKeyValue = ({
  label,
  value,
  marked,
}) => {
  const content = marked ? <mark>{value}</mark> : value;

  return (
    <KeyValue
      label={label}
    >
      {content}
    </KeyValue>
  );
};

VersionKeyValue.defaultProps = {
  marked: false,
};

VersionKeyValue.propTypes = {
  label: PropTypes.node.isRequired,
  marked: PropTypes.bool,
  value: PropTypes.node,
};
