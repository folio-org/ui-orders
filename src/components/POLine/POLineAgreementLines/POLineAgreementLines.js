import React from 'react';
import PropTypes from 'prop-types';

import {
  Accordion,
  Badge,
} from '@folio/stripes/components';

import { ACCORDION_ID } from '../const';

const POLineAgreementLines = ({ agreementLines, label }) => {
  return (
    <Accordion
      displayWhenClosed={<Badge>{agreementLines.length}</Badge>}
      id={ACCORDION_ID.relatedAgreementLines}
      label={label}
    >
      {/* UIOR-446 */}
      <div>{agreementLines.length}</div>
    </Accordion>
  );
};

POLineAgreementLines.propTypes = {
  agreementLines: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.node.isRequired,
};

export default POLineAgreementLines;
