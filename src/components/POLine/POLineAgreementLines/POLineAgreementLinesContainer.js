import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  Accordion,
  Badge,
  Loading,
} from '@folio/stripes/components';
import {
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  AGREEMENT_LINES,
} from '../../Utils/resources';

import { ACCORDION_ID } from '../const';
import POLineAgreementLines from './POLineAgreementLines';

const POLineAgreementLinesContainer = ({ lineId, label, mutator }) => {
  const [agreementLines, setAgreementLines] = useState();
  const showCallout = useShowCallout();

  useEffect(() => {
    setAgreementLines();

    mutator.agreementLines.GET()
      .then(setAgreementLines)
      .catch(() => {
        setAgreementLines([]);

        showCallout({ messageId: 'ui-orders.relatedAgreementLines.actions.load.error', type: 'error' });
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineId, showCallout]);

  if (!agreementLines) return <Loading />;

  return (
    <Accordion
      displayWhenClosed={<Badge>{agreementLines?.length}</Badge>}
      id={ACCORDION_ID.relatedAgreementLines}
      label={label}
    >
      <POLineAgreementLines agreementLines={agreementLines} />
    </Accordion>
  );
};

POLineAgreementLinesContainer.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  lineId: PropTypes.string.isRequired,
  label: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
};

POLineAgreementLinesContainer.manifest = Object.freeze({
  agreementLines: AGREEMENT_LINES,
});

export default stripesConnect(POLineAgreementLinesContainer);
