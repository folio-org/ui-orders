import React, {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  KeyValue,
  Loading,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  batchFetch,
  transactionsManifest,
  TRANSACTION_TYPES,
} from '@folio/stripes-acq-components';

const TotalExpendedValue = ({ orderInvoicesIds, label, mutator }) => {
  const [totalExpended, setTotalExpended] = useState();

  useEffect(
    () => {
      setTotalExpended();

      if (orderInvoicesIds.length) {
        batchFetch(mutator.transactions, orderInvoicesIds, (itemsChunk) => {
          const query = itemsChunk
            .map(id => `sourceInvoiceId==${id}`)
            .join(' or ');

          return `(transactionType=${TRANSACTION_TYPES.payment} or transactionType=${TRANSACTION_TYPES.credit}) and (${query})`;
        })
          .then(transactions => {
            const total = transactions.reduce((acc, { amount }) => acc + amount, 0);

            setTotalExpended(total);
          })
          .catch(() => setTotalExpended(0));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orderInvoicesIds],
  );

  if (totalExpended === undefined) {
    return <Loading />;
  }

  return (
    <KeyValue label={label}>
      <AmountWithCurrencyField amount={totalExpended} />
    </KeyValue>
  );
};

TotalExpendedValue.manifest = Object.freeze({
  transactions: transactionsManifest,
});

TotalExpendedValue.propTypes = {
  orderInvoicesIds: PropTypes.arrayOf(PropTypes.string),
  label: PropTypes.node.isRequired,
  mutator: PropTypes.object.isRequired,
};

TotalExpendedValue.defaultProps = {
  orderInvoicesIds: [],
};

export default stripesConnect(TotalExpendedValue);
