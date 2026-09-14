import PropTypes from 'prop-types';

import { ConnectedTasksJobsPlugin } from './ConnectedTasksJobsPlugin';

export const ConnectedTasksJobsPane = props => {
  return (
    <ConnectedTasksJobsPlugin
      {...props}
      componentType="ConnectedTasksJobsPane"
    />
  );
};

ConnectedTasksJobsPane.propTypes = {
  recordId: PropTypes.string.isRequired,
  recordObject: PropTypes.object,
  recordType: PropTypes.oneOf(['order', 'orderLine']).isRequired,
};

ConnectedTasksJobsPane.defaultProps = {
  recordObject: undefined,
};
