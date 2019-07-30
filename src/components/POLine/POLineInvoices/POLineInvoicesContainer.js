import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { Accordion } from '@folio/stripes/components';

import {
  INVOICE_LINES, INVOICES,
  RECEIVING_HISTORY,
} from '../../Utils/resources';

import POLineInvoices from './POLineInvoices';

const POLineInvoicesContainer = ({ accordionId, label, resources, vendors, mutator }) => {
  const lineInvoices = get(resources, ['invoices', 'records'], []);
  const invoiceLines = get(resources, ['invoiceLines', 'records'], []);
  const pieces = get(resources, ['pieces', 'records'], []);

  useEffect(() => {
    mutator.invoiceLines.reset();
    mutator.invoices.reset();

    mutator.invoiceLines.GET().then(response => {
      const invoicesIds = response.map(item => item.invoiceId);

      mutator.invoices.GET({
        params: {
          query: invoicesIds.length ? invoicesIds.map(id => `id==${id}`).join(' or ') : 'id==null',
        },
      });
    });
  }, []);

  return (
    <Accordion
      label={label}
      id={accordionId}
    >
      <POLineInvoices
        lineInvoices={lineInvoices}
        invoiceLines={invoiceLines}
        pieces={pieces}
        vendors={vendors}
      />
    </Accordion>
  );
}

POLineInvoicesContainer.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  lineId: PropTypes.string.isRequired,
  label: PropTypes.object.isRequired,
  accordionId: PropTypes.string.isRequired,
  mutator: PropTypes.shape({
    pieces: PropTypes.object.isRequired,
    invoices: PropTypes.object.isRequired,
    invoiceLines: PropTypes.object.isRequired,
  }).isRequired,
  resources: PropTypes.object.isRequired,
  vendors: PropTypes.arrayOf(PropTypes.object),
};

POLineInvoicesContainer.defaultProps = {
  vendors: [],
};

POLineInvoicesContainer.manifest = Object.freeze({
  pieces: {
    ...RECEIVING_HISTORY,
    fetch: true,
    accumulate: false,
    params: {
      query: 'checkin==true and poLineId==!{lineId}',
    },
  },
  invoiceLines: {
    ...INVOICE_LINES,
    fetch: false,
    accumulate: true,
    params: {
      query: 'poLineId==!{lineId}',
    },
  },
  invoices: {
    ...INVOICES,
    fetch: false,
    accumulate: true,
  },
});

export default stripesConnect(POLineInvoicesContainer);
