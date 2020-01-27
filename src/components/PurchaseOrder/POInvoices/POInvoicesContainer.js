import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import { Accordion } from '@folio/stripes/components';
import {
  batchFetch,
  organizationsManifest,
} from '@folio/stripes-acq-components';

import {
  INVOICES,
  ORDER_INVOICES,
} from '../../Utils/resources';

import POInvoices from './POInvoices';
import { ACCORDION_ID } from '../../POLine/const';

const POInvoicesContainer = ({ label, orderId, mutator }) => {
  const [orderInvoices, setOrderInvoices] = useState();
  const [vendors, setVendors] = useState();

  useEffect(() => {
    setOrderInvoices();
    setVendors();

    mutator.orderInvoicesRelns.GET().then(response => {
      const invoicesIds = response.map(item => item.invoiceId);

      batchFetch(mutator.invoices, invoicesIds)
        .then(orderInvoicesResponse => {
          setOrderInvoices(orderInvoicesResponse);

          return orderInvoicesResponse;
        }).then(orderInvoicesResponse => {
          const vendorIds = orderInvoicesResponse.map(item => item.vendorId);

          batchFetch(mutator.invoicesVendors, vendorIds)
            .then(setVendors);
        });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  return (
    <Accordion
      label={label}
      id={ACCORDION_ID.relatedInvoices}
    >
      <POInvoices
        orderInvoices={orderInvoices}
        vendors={vendors}
      />
    </Accordion>
  );
};

POInvoicesContainer.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  orderId: PropTypes.string.isRequired,
  label: PropTypes.object.isRequired,
  mutator: PropTypes.shape({
    orderInvoicesRelns: PropTypes.object.isRequired,
    invoices: PropTypes.object.isRequired,
    invoicesVendors: PropTypes.object.isRequired,
  }).isRequired,
};

POInvoicesContainer.defaultProps = {
};

POInvoicesContainer.manifest = Object.freeze({
  orderInvoicesRelns: {
    ...ORDER_INVOICES,
    fetch: false,
    accumulate: true,
    params: {
      query: 'purchaseOrderId==!{orderId}',
    },
  },
  invoices: {
    ...INVOICES,
    fetch: false,
    accumulate: true,
  },
  invoicesVendors: {
    ...organizationsManifest,
    accumulate: true,
    fetch: false,
  },
});

export default stripesConnect(POInvoicesContainer);
