import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  List,
  NoValue,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  KeyValueInline,
} from '@folio/stripes-acq-components';

export const summurizeLinesQuantity = (field, lines = []) => {
  return lines.reduce((acc, line) => {
    const quantity = line?.[field] || 0;

    return acc + quantity;
  }, 0);
};

export const getElementsList = (items) => (
  <List
    items={items}
    listStyle="bullets"
    marginBottom0
  />
);

export const getColumns = (lines = []) => {
  const totalQuantityPhysical = summurizeLinesQuantity('quantityPhysical', lines);
  const totalQuantityElectronic = summurizeLinesQuantity('quantityElectronic', lines);

  return [
    {
      title: <FormattedMessage id="ui-orders.print.polNumber" />,
      size: 1,
      align: 'center',
      render: line => line.poLineNumber,
    },
    {
      title: <FormattedMessage id="ui-orders.orderLineList.titleOrPackage" />,
      size: 3,
      align: 'left',
      render: line => line.titleOrPackage,
    },
    {
      title: <FormattedMessage id="ui-orders.print.details" />,
      size: 3,
      align: 'left',
      render: line => (
        <>
          <KeyValueInline
            label={<FormattedMessage id="ui-orders.itemDetails.publicationDate" />}
            value={line.sourceRecord?.publicationDate}
          />
          <KeyValueInline
            label={<FormattedMessage id="ui-orders.itemDetails.publisher" />}
            value={line.sourceRecord?.publisher}
          />
          <KeyValueInline
            label={<FormattedMessage id="ui-orders.itemDetails.contributors" />}
            value={line.sourceRecord.contributors?.map(({ contributor }) => `"${contributor}"`).join(', ')}
          />
          <KeyValueInline
            label={<FormattedMessage id="ui-orders.itemDetails.productIds" />}
            value={line.productIdentifier && getElementsList(line.productIdentifier.split(' | '))}
          />
          <KeyValueInline
            label={<FormattedMessage id="ui-orders.lineListing.fundCode" />}
            value={line.sourceRecord.fundDistribution?.map(({ code }) => code).join(', ')}
          />
          <KeyValueInline
            label={<FormattedMessage id="ui-orders.poLine.rush" />}
            value={<FormattedMessage id={`ui-orders.filter.${Boolean(line.rush).toString()}`} />}
          />
        </>
      ),
    },
    {
      title: <FormattedMessage id="ui-orders.vendor.instructions" />,
      size: 'auto',
      align: 'left',
      render: line => line.instructions || <NoValue />,
    },
    {
      title: <FormattedMessage id="ui-orders.cost.quantityPhysical" />,
      size: 1,
      align: 'right',
      hidden: !totalQuantityPhysical,
      render: line => line.quantityPhysical || <NoValue />,
    },
    {
      title: <FormattedMessage id="ui-orders.cost.quantityElectronic" />,
      size: 1,
      align: 'right',
      hidden: !totalQuantityElectronic,
      render: line => line.quantityElectronic || <NoValue />,
    },
    {
      title: <FormattedMessage id="ui-orders.cost.estimatedPrice" />,
      size: 'auto',
      align: 'right',
      render: line => {
        return (
          <AmountWithCurrencyField
            currency={line.currency}
            amount={line.poLineEstimatedPrice}
          />
        );
      },
    },
  ];
};
