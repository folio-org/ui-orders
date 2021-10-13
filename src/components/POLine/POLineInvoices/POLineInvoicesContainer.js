import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import { Accordion } from '@folio/stripes/components';
import {
  batchFetch,
  organizationsManifest,

  ORDER_PIECES_API,
} from '@folio/stripes-acq-components';

import {
  INVOICE_LINES, INVOICES,
} from '../../Utils/resources';

import POLineInvoices from './POLineInvoices';
import { ACCORDION_ID } from '../const';

const POLineInvoicesContainer = ({ lineId, label, mutator }) => {
  const [lineInvoices, setLineInvoices] = useState();
  const [invoiceLines, setInvoiceLines] = useState();
  const [pieces, setPieces] = useState();
  const [vendors, setVendors] = useState();

  useEffect(() => {
    setLineInvoices();
    setInvoiceLines();
    setPieces();
    setVendors();

    mutator.invoiceLines.GET().then(response => {
      setInvoiceLines(response);
      const invoicesIds = response.map(item => item.invoiceId);

      batchFetch(mutator.invoices, invoicesIds)
        .then(invoicesResponse => {
          setLineInvoices(invoicesResponse);

          return invoicesResponse;
        })
        .then(invoicesResponse => {
          const vendorIds = invoicesResponse.map(item => item.vendorId);

          batchFetch(mutator.invoiceLinesVendors, vendorIds)
            .then(setVendors);
        });
    });

    mutator.pieces.GET().then(setPieces);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineId]);

  return (
    <Accordion
      label={label}
      id={ACCORDION_ID.relatedInvoices}
    >
      <POLineInvoices
        lineInvoices={lineInvoices}
        invoiceLines={invoiceLines}
        pieces={pieces}
        vendors={vendors}
      />
    </Accordion>
  );
};

POLineInvoicesContainer.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  lineId: PropTypes.string.isRequired,
  label: PropTypes.object.isRequired,
  mutator: PropTypes.shape({
    pieces: PropTypes.object.isRequired,
    invoices: PropTypes.object.isRequired,
    invoiceLines: PropTypes.object.isRequired,
    invoiceLinesVendors: PropTypes.object.isRequired,
  }).isRequired,
};

POLineInvoicesContainer.defaultProps = {
};

POLineInvoicesContainer.manifest = Object.freeze({
  pieces: {
    type: 'okapi',
    path: ORDER_PIECES_API,
    fetch: false,
    accumulate: true,
    throwErrors: false,
    records: 'pieces',
    params: {
      query: 'titles.poLineId==!{lineId}',
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
  invoiceLinesVendors: {
    ...organizationsManifest,
    accumulate: true,
    fetch: false,
  },
});

export default stripesConnect(POLineInvoicesContainer);
