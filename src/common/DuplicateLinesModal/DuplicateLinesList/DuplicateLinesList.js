import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  Headline,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';
import {
  FolioFormattedDate,
  ORDER_STATUS_LABEL,
} from '@folio/stripes-acq-components';

const visibleColumns = [
  'poLineNumber',
  'updatedDate',
  'titleOrPackage',
  'productIds',
  'vendorRefNumber',
  'fundCode',
  'orderStatus',
];
const columnMapping = {
  poLineNumber: <FormattedMessage id="ui-orders.orderLineList.poLineNumber" />,
  updatedDate: <FormattedMessage id="ui-orders.orderLineList.updatedDate" />,
  titleOrPackage: <FormattedMessage id="ui-orders.orderLineList.titleOrPackage" />,
  productIds: <FormattedMessage id="ui-orders.orderLineList.productIds" />,
  vendorRefNumber: <FormattedMessage id="ui-orders.orderLineList.vendorRefNumber" />,
  fundCode: <FormattedMessage id="ui-orders.orderLineList.funCodes" />,
  orderStatus: <FormattedMessage id="ui-orders.orderLineList.orderWorkflow" />,
};

const resultsFormatter = {
  poLineNumber: line => (
    <Link to={`/orders/lines/view/${line.id}`}>
      {line.poLineNumber}
    </Link>
  ),
  updatedDate: line => <FolioFormattedDate value={line.metadata?.updatedDate} utc={false} />,
  productIds: line => line.details?.productIds?.map(({ productId }) => productId)?.join(', ') || <NoValue />,
  vendorRefNumber: line => line.vendorDetail?.referenceNumbers?.map(({ refNumber }) => refNumber)?.join(', ') || <NoValue />,
  fundCode: line => line.fundDistribution?.map(({ code }) => code)?.filter(Boolean)?.join(', ') || <NoValue />,
  orderStatus: line => ORDER_STATUS_LABEL[line.order.workflowStatus],
};

const DuplicateLinesList = ({ lines = [] }) => {
  return (
    <>
      <Headline>
        <FormattedMessage id="ui-orders.duplicateLines.confirmation.title" />
      </Headline>
      <MultiColumnList
        id="duplicate-lines-list"
        contentData={lines}
        visibleColumns={visibleColumns}
        columnMapping={columnMapping}
        formatter={resultsFormatter}
        interactive={false}
      />
    </>
  );
};

DuplicateLinesList.propTypes = {
  lines: PropTypes.arrayOf(PropTypes.object),
};

export default DuplicateLinesList;
