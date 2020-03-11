import PropTypes from 'prop-types';

export const closingReasonShape = PropTypes.shape({
  id: PropTypes.string,
  reason: PropTypes.string,
});

export const closingReasonsShape = PropTypes.arrayOf(closingReasonShape);
