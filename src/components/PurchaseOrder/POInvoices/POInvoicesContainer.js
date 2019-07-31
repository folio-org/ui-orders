import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { Accordion } from '@folio/stripes/components';

import {
  INVOICES,
  ORDER_INVOICES,
} from '../../Utils/resources';

import POInvoices from './POInvoices';

const POInvoicesContainer = ({ label, orderId, accordionId, resources, vendors, mutator, stripes }) => {
  const orderInvoices = get(resources, ['invoices', 'records'], []);

  useEffect(() => {
    mutator.orderInvoicesRelns.reset();
    mutator.invoices.reset();

    mutator.orderInvoicesRelns.GET().then(response => {
      const invoicesIds = response.map(item => item.invoiceId);

      if (invoicesIds.length) {
        mutator.invoices.GET({
          params: {
            query: invoicesIds.map(id => `id==${id}`).join(' or '),
          },
        });
      }
    });
  }, [orderId]);

  return (
    <Accordion
      label={label}
      id={accordionId}
    >
      <POInvoices
        stripes={stripes}
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
  stripes: PropTypes.object.isRequired,
  accordionId: PropTypes.string.isRequired,
  mutator: PropTypes.shape({
    orderInvoicesRelns: PropTypes.object.isRequired,
    invoices: PropTypes.object.isRequired,
  }).isRequired,
  resources: PropTypes.object.isRequired,
  vendors: PropTypes.arrayOf(PropTypes.object),
};

POInvoicesContainer.defaultProps = {
  vendors: [],
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
});

export default stripesConnect(POInvoicesContainer);
