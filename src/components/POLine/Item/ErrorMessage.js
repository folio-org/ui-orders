import React from 'react';
import PropTypes from 'prop-types';

import css from './ErrorMessage.css';

export const ErrorMessage = ({ children }) => {
  return <div className={css.errorMessage}>{children}</div>;
};

ErrorMessage.propTypes = {
  children: PropTypes.node,
};
