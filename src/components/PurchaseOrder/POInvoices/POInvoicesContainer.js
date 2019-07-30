import React from 'react';
import PropTypes from 'prop-types';

import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { Accordion } from '@folio/stripes/components';

import {
  ORDER_INVOICES,
} from '../../Utils/resources';

import POInvoices from './POInvoices';

const POInvoicesContainer = ({ label, accordionId, resources, vendors }) => {
  const orderInvoicesRelns = get(resources, ['orderInvoicesRelns', 'records'], []);

  return (
    <Accordion
      label={label}
      id={accordionId}
    >
      <POInvoices
        orderInvoicesRelns={orderInvoicesRelns}
        vendors={vendors}
      />
    </Accordion>
  );
};

POInvoicesContainer.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  orderId: PropTypes.string.isRequired,
  label: PropTypes.object.isRequired,
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
    params: {
      query: 'purchaseOrderId==!{orderId}',
    },
  },
});

export default stripesConnect(POInvoicesContainer);
