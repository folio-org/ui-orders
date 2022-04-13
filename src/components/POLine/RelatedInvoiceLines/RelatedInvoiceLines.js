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
} from '@folio/stripes-acq-components';

import { ACCORDION_ID } from '../const';
import { useConnectedInvoiceLines } from './useConnectedInvoiceLines';

const COLUMN_INVOICE_DATE = 'invoiceDate';
const visibleColumns = [
  'vendorInvoiceNo',
  'invoiceLine',
  COLUMN_INVOICE_DATE,
  'vendorName',
  'status',
  'quantity',
  'amount',
  'comment',
];
const columnMapping = {
  invoiceLine: <FormattedMessage id="ui-orders.relatedInvoiceLines.invoiceLine" />,
  [COLUMN_INVOICE_DATE]: <FormattedMessage id="ui-orders.relatedInvoiceLines.invoiceDate" />,
  vendorName: <FormattedMessage id="ui-orders.relatedInvoiceLines.vendorName" />,
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
  [COLUMN_INVOICE_DATE]: invoiceLine => <FolioFormattedDate value={invoiceLine.invoice?.invoiceDate} />,
  vendorName: invoiceLine => invoiceLine.vendor?.name,
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
  const { isLoading, invoiceLines } = useConnectedInvoiceLines(lineId);

  return (
    <Accordion
      label={label}
      id={ACCORDION_ID.relatedInvoiceLines}
    >
      {
        isLoading ? <Loading /> : (
          <FrontendSortingMCL
            columnMapping={columnMapping}
            contentData={invoiceLines}
            formatter={resultFormatter}
            id="invoiceLines"
            interactive={false}
            sortDirection={DESC_DIRECTION}
            sortedColumn={COLUMN_INVOICE_DATE}
            sorters={sorters}
            visibleColumns={visibleColumns}
            columnIdPrefix="invoice-lines"
          />
        )
      }
    </Accordion>
  );
};

RelatedInvoiceLines.propTypes = {
  lineId: PropTypes.string.isRequired,
  label: PropTypes.object,
};
