import PropTypes from 'prop-types';

export const fundShape = PropTypes.shape({
  id: PropTypes.string,
  code: PropTypes.string,
});

export const fundsShape = PropTypes.arrayOf(fundShape);
