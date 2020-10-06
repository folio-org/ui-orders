import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import { Accordion } from '@folio/stripes/components';
import {
  batchFetch,
  organizationsManifest,
} from '@folio/stripes-acq-components';

import { INVOICES } from '../../Utils/resources';

import POInvoices from './POInvoices';
import { ACCORDION_ID } from '../../POLine/const';

const POInvoicesContainer = ({ label, orderInvoicesIds, mutator }) => {
  const [orderInvoices, setOrderInvoices] = useState();
  const [vendors, setVendors] = useState();

  useEffect(() => {
    setOrderInvoices();
    setVendors();

    batchFetch(mutator.invoices, orderInvoicesIds)
      .then(orderInvoicesResponse => {
        setOrderInvoices(orderInvoicesResponse);

        return orderInvoicesResponse;
      })
      .then(orderInvoicesResponse => {
        const vendorIds = orderInvoicesResponse.map(item => item.vendorId);

        return batchFetch(mutator.invoicesVendors, vendorIds);
      })
      .then(setVendors);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderInvoicesIds]);

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
  orderInvoicesIds: PropTypes.arrayOf(PropTypes.string),
  label: PropTypes.object.isRequired,
  mutator: PropTypes.shape({
    invoices: PropTypes.object.isRequired,
    invoicesVendors: PropTypes.object.isRequired,
  }).isRequired,
};

POInvoicesContainer.defaultProps = {
  orderInvoicesIds: [],
};

POInvoicesContainer.manifest = Object.freeze({
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
