import PropTypes from 'prop-types';

import { ConnectedTasksJobsPlugin } from './ConnectedTasksJobsPlugin';

export const ConnectedTasksJobsButton = props => {
  return (
    <ConnectedTasksJobsPlugin
      {...props}
      componentType="ConnectedTasksJobsButton"
    />
  );
};

ConnectedTasksJobsButton.propTypes = {
  recordId: PropTypes.string.isRequired,
  recordObject: PropTypes.object,
  recordType: PropTypes.oneOf(['order', 'orderLine']).isRequired,
};

ConnectedTasksJobsButton.defaultProps = {
  recordObject: undefined,
};
