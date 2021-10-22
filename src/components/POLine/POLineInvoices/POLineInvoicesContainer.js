import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import { Accordion } from '@folio/stripes/components';
import {
  batchFetch,
  organizationsManifest,
} from '@folio/stripes-acq-components';

import {
  INVOICE_LINES, INVOICES,
} from '../../Utils/resources';

import POLineInvoices from './POLineInvoices';
import { ACCORDION_ID } from '../const';

const POLineInvoicesContainer = ({ lineId, label, mutator }) => {
  const [lineInvoices, setLineInvoices] = useState();
  const [invoiceLines, setInvoiceLines] = useState();
  const [vendors, setVendors] = useState();

  useEffect(() => {
    setLineInvoices();
    setInvoiceLines();
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
    invoices: PropTypes.object.isRequired,
    invoiceLines: PropTypes.object.isRequired,
    invoiceLinesVendors: PropTypes.object.isRequired,
  }).isRequired,
};

POLineInvoicesContainer.defaultProps = {
};

POLineInvoicesContainer.manifest = Object.freeze({
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
