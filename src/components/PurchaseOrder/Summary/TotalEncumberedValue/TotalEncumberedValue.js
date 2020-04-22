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
  transactionsManifest,
} from '@folio/stripes-acq-components';

const TotalEncumberedValue = ({ orderId, label, mutator }) => {
  const [totalEncumbered, setTotalEncumbered] = useState();

  useEffect(
    () => {
      setTotalEncumbered();

      if (orderId) {
        mutator.orderTransactions.GET()
          .then(transactions => {
            const total = transactions.reduce((acc, { amount }) => acc + amount, 0);

            setTotalEncumbered(total);
          })
          .catch(() => setTotalEncumbered(0));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orderId],
  );

  if (totalEncumbered === undefined) {
    return <Loading />;
  }

  return (
    <KeyValue label={label}>
      <AmountWithCurrencyField amount={totalEncumbered} />
    </KeyValue>
  );
};

TotalEncumberedValue.manifest = Object.freeze({
  orderTransactions: {
    ...transactionsManifest,
    params: {
      query: 'encumbrance.sourcePurchaseOrderId==!{orderId}',
    },
  },
});

TotalEncumberedValue.propTypes = {
  orderId: PropTypes.string,
  label: PropTypes.node.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(TotalEncumberedValue);
