import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  Accordion,
  Loading,
  NoValue,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  FolioFormattedDate,
  FrontendSortingMCL,
  DESC_DIRECTION,
  RESULT_COUNT_INCREMENT,
  useLocalPagination,
  PrevNextPagination,
} from '@folio/stripes-acq-components';

import { ACCORDION_ID } from '../const';
import { useConnectedInvoiceLines } from './useConnectedInvoiceLines';

const COLUMN_INVOICE_DATE = 'invoiceDate';
const visibleColumns = [
  'vendorInvoiceNo',
  'invoiceLine',
  'fiscalYear',
  COLUMN_INVOICE_DATE,
  'vendorCode',
  'subscriptionStart',
  'subscriptionEnd',
  'subscriptionDescription',
  'status',
  'quantity',
  'amount',
  'comment',
];
const columnMapping = {
  invoiceLine: <FormattedMessage id="ui-orders.relatedInvoiceLines.invoiceLine" />,
  fiscalYear: <FormattedMessage id="ui-orders.relatedInvoices.fiscalYear" />,
  [COLUMN_INVOICE_DATE]: <FormattedMessage id="ui-orders.relatedInvoiceLines.invoiceDate" />,
  vendorCode: <FormattedMessage id="ui-orders.relatedInvoiceLines.vendorCode" />,
  subscriptionStart: <FormattedMessage id="ui-orders.relatedInvoices.subscriptionStart" />,
  subscriptionEnd: <FormattedMessage id="ui-orders.relatedInvoices.subscriptionEnd" />,
  subscriptionDescription: <FormattedMessage id="ui-orders.relatedInvoices.subscriptionDescription" />,
  vendorInvoiceNo: <FormattedMessage id="ui-orders.relatedInvoiceLines.vendorInvoiceNo" />,
  status: <FormattedMessage id="ui-orders.relatedInvoiceLines.status" />,
  quantity: <FormattedMessage id="ui-orders.relatedInvoiceLines.quantity" />,
  amount: <FormattedMessage id="ui-orders.relatedInvoiceLines.amount" />,
  comment: <FormattedMessage id="ui-orders.relatedInvoiceLines.comment" />,
};
const resultFormatter = {
  invoiceLine: invoiceLine => (
    <Link
      data-test-link-to-invoice
      to={`/invoice/view/${invoiceLine.invoice?.id}/line/${invoiceLine.id}/view`}
    >
      {`${invoiceLine.invoiceLineNumber}`}
    </Link>
  ),
  fiscalYear: (invoice) => invoice.fiscalYear?.code || <NoValue />,
  [COLUMN_INVOICE_DATE]: invoiceLine => <FolioFormattedDate value={invoiceLine.invoice?.invoiceDate} />,
  vendorCode: (invoice) => invoice.vendor?.code || <NoValue />,
  subscriptionStart: (invoice) => <FolioFormattedDate value={invoice.fiscalYear?.periodStart} />,
  subscriptionEnd: (invoice) => <FolioFormattedDate value={invoice.fiscalYear?.periodEnd} />,
  subscriptionDescription: (invoice) => invoice.fiscalYear?.description || <NoValue />,
  vendorInvoiceNo: invoiceLine => invoiceLine.invoice?.vendorInvoiceNo || <NoValue />,
  status: invoiceLine => <FormattedMessage id={`ui-invoice.invoice.status.${invoiceLine.invoiceLineStatus.toLowerCase()}`} />,
  amount: invoiceLine => (
    <AmountWithCurrencyField
      currency={invoiceLine.invoice?.currency}
      amount={invoiceLine.total}
    />
  ),
};
const sorters = {
  [COLUMN_INVOICE_DATE]: ({ invoiceDate }) => invoiceDate,
};

export const RelatedInvoiceLines = ({ lineId, label }) => {
  const { isLoading, invoiceLines, totalInvoiceLines } = useConnectedInvoiceLines(lineId);
  const { paginatedData, pagination, setPagination } = useLocalPagination(invoiceLines, RESULT_COUNT_INCREMENT);

  return (
    <Accordion
      label={label}
      id={ACCORDION_ID.relatedInvoiceLines}
    >
      {
        isLoading ? <Loading /> : (
          <FrontendSortingMCL
            columnMapping={columnMapping}
            contentData={paginatedData}
            formatter={resultFormatter}
            id="invoiceLines"
            interactive={false}
            sortDirection={DESC_DIRECTION}
            sortedColumn={COLUMN_INVOICE_DATE}
            sorters={sorters}
            visibleColumns={visibleColumns}
            columnIdPrefix="invoice-lines"
            hasPagination
          />
        )
      }
      {invoiceLines?.length > 0 && (
        <PrevNextPagination
          {...pagination}
          totalCount={totalInvoiceLines}
          onChange={setPagination}
          disabled={false}
        />
      )}
    </Accordion>
  );
};

RelatedInvoiceLines.propTypes = {
  lineId: PropTypes.string.isRequired,
  label: PropTypes.object,
};
