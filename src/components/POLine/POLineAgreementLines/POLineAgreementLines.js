import React from 'react';
import PropTypes from 'prop-types';

const POLineAgreementLines = ({ agreementLines }) => {
  return (
    // UIOR-446
    <div>{agreementLines.length}</div>
  );
};

POLineAgreementLines.propTypes = {
  agreementLines: PropTypes.arrayOf(PropTypes.object),
};

export default POLineAgreementLines;
