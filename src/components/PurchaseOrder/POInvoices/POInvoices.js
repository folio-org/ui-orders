import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
  find,
  get,
  isEqualWith,
} from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { MultiColumnList } from '@folio/stripes/components';
import { AmountWithCurrencyField } from '@folio/stripes-acq-components';

import FolioFormattedDate from '../../FolioFormattedDate';
import { INVOICES } from '../../Utils/resources';

const visibleColumns = ['invoice', 'invoiceDate', 'vendorName', 'status', 'expendedAmount'];
const columnMapping = {
  invoice: <FormattedMessage id="ui-orders.relatedInvoices.invoice" />,
  invoiceDate: <FormattedMessage id="ui-orders.relatedInvoices.invoiceDate" />,
  vendorName: <FormattedMessage id="ui-orders.relatedInvoices.vendorName" />,
  status: <FormattedMessage id="ui-orders.relatedInvoices.status" />,
  expendedAmount: <FormattedMessage id="ui-orders.relatedInvoices.expendedAmount" />,
};
const columnWidths = {
  invoice: '20%',
  invoiceDate: '15%',
  vendorName: '25%',
  status: '15%',
  expendedAmount: '25%',
};

class POInvoices extends Component {
  static manifest = Object.freeze({
    orderInvoicesRelns: [],
    invoices: {
      ...INVOICES,
      params: {
        query: (queryParams, pathComponents, resourceData, logger, props) => {
          const invoiceLines = get(props, 'orderInvoicesRelns', []);
          const invoicesIds = invoiceLines.map(item => item.invoiceId);

          return invoicesIds.length ? invoicesIds.map(id => `id==${id}`).join(' or ') : 'id==null';
        },
      },
    },
  });

  componentDidUpdate() {
    const { orderInvoicesRelns, resources, mutator } = this.props;

    if (!isEqualWith(resources.orderInvoicesRelns, orderInvoicesRelns, ['invoiceId'])) {
      mutator.orderInvoicesRelns.replace(orderInvoicesRelns);
    }
  }

  render() {
    const { resources, vendors } = this.props;

    const orderInvoices = get(resources, ['invoices', 'records'], []);

    const resultFormatter = {
      invoice: invoice => (
        <Link
          data-test-link-to-invoice
          to={`/invoices/view/${invoice.id}`}
        >
          {get(invoice, 'folioInvoiceNo', '')}
        </Link>
      ),
      invoiceDate: invoice => <FolioFormattedDate value={get(invoice, 'invoiceDate')} />,
      vendorName: invoice => get(find(vendors, ['id', get(invoice, 'vendorId', '')]), 'name', ''),
      status: invoice => get(invoice, 'status', ''),
      expendedAmount: invoice => (
        <AmountWithCurrencyField
          currency={invoice.currency}
          amount={get(invoice, 'total', 0)}
        />
      ),
    };

    return (
      <MultiColumnList
        contentData={orderInvoices}
        formatter={resultFormatter}
        visibleColumns={visibleColumns}
        columnMapping={columnMapping}
        columnWidths={columnWidths}
      />
    );
  }
}

POInvoices.propTypes = {
  resources: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
  orderInvoicesRelns: PropTypes.arrayOf(PropTypes.object),
  vendors: PropTypes.arrayOf(PropTypes.object),
};

POInvoices.defaultProps = {
  orderInvoicesRelns: [],
  vendors: [],
};

export default stripesConnect(POInvoices);
