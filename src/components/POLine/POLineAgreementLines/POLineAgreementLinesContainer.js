import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  Accordion,
  Badge,
  Loading,
} from '@folio/stripes/components';
import {
  baseManifest,
  LIMIT_MAX,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { AGREEMENT_LINES_API } from '../../Utils/api';
import { ACCORDION_ID } from '../const';
import POLineAgreementLines from './POLineAgreementLines';

const POLineAgreementLinesContainer = ({ lineId, label, mutator }) => {
  const [agreementLines, setAgreementLines] = useState();
  const showCallout = useShowCallout();

  useEffect(() => {
    setAgreementLines();

    mutator.agreementLines.GET({
      params: {
        filters: `poLines.poLineId==${lineId}`,
        perPage: LIMIT_MAX,
      },
    })
      .then(setAgreementLines)
      .catch(() => {
        showCallout({ messageId: 'ui-orders.relatedAgreementLines.actions.load.error', type: 'error' });
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineId]);

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
  lineId: PropTypes.string.isRequired,
  label: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
};

POLineAgreementLinesContainer.manifest = Object.freeze({
  agreementLines: {
    ...baseManifest,
    accumulate: true,
    fetch: false,
    path: AGREEMENT_LINES_API,
  },
});

export default stripesConnect(POLineAgreementLinesContainer);
