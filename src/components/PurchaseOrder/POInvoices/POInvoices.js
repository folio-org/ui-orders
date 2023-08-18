import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { get } from 'lodash';

import { NoValue } from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  FolioFormattedDate,
  FrontendSortingMCL,
  DESC_DIRECTION,
  RESULT_COUNT_INCREMENT,
  useLocalPagination,
  PrevNextPagination,
} from '@folio/stripes-acq-components';

import {
  COLUMN_INVOICE_DATE,
  COLUMN_MAPPING,
  VISIBLE_COLUMNS,
} from './constants';

const sorters = {
  [COLUMN_INVOICE_DATE]: ({ invoiceDate }) => invoiceDate,
};

const getFormattedDate = (date) => {
  if (!date) return <NoValue />;

  return <FolioFormattedDate value={date} />;
};

const POInvoices = ({ orderInvoices }) => {
  const { paginatedData, pagination, setPagination } = useLocalPagination(orderInvoices, RESULT_COUNT_INCREMENT);

  if (!orderInvoices) {
    return null;
  }

  const resultFormatter = {
    vendorInvoiceNo: invoice => invoice.vendorInvoiceNo || <NoValue />,
    invoice: invoice => (
      <Link
        data-test-link-to-invoice
        to={`/invoice/view/${invoice.id}`}
      >
        {get(invoice, 'folioInvoiceNo', '')}
      </Link>
    ),
    fiscalYear: invoice => invoice.fiscalYear?.code || <NoValue />,
    [COLUMN_INVOICE_DATE]: invoice => <FolioFormattedDate value={get(invoice, 'invoiceDate')} />,
    vendorCode: invoice => invoice.vendor?.code || <NoValue />,
    subscriptionStart: ({ fiscalYear }) => getFormattedDate(fiscalYear?.periodStart),
    subscriptionEnd: ({ fiscalYear }) => getFormattedDate(fiscalYear?.periodEnd),
    subscriptionDescription: ({ fiscalYear }) => fiscalYear?.description || <NoValue />,
    status: invoice => get(invoice, 'status', ''),
    expendedAmount: invoice => (
      <AmountWithCurrencyField
        currency={invoice.currency}
        amount={get(invoice, 'total', 0)}
      />
    ),
  };

  return (
    <>
      <FrontendSortingMCL
        columnMapping={COLUMN_MAPPING}
        contentData={paginatedData}
        formatter={resultFormatter}
        id="orderInvoices"
        interactive={false}
        sortDirection={DESC_DIRECTION}
        sortedColumn={COLUMN_INVOICE_DATE}
        sorters={sorters}
        visibleColumns={VISIBLE_COLUMNS}
        columnIdPrefix="invoices"
        hasPagination
      />
      {orderInvoices?.length > 0 && (
        <PrevNextPagination
          {...pagination}
          totalCount={orderInvoices.length}
          onChange={setPagination}
          disabled={false}
        />
      )}
    </>
  );
};

POInvoices.propTypes = {
  orderInvoices: PropTypes.arrayOf(PropTypes.object),
};

export default POInvoices;
