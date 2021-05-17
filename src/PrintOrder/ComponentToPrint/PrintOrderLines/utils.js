import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  NoValue,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  KeyValueInline,
} from '@folio/stripes-acq-components';

export const summurizeLinesQuantity = (field, lines = []) => {
  return lines.reduce((acc, line) => {
    const quantity = line?.cost?.[field] || 0;

    return acc + quantity;
  }, 0);
};

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
            value={line.publicationDate}
          />
          <KeyValueInline
            label={<FormattedMessage id="ui-orders.itemDetails.publisher" />}
            value={line.publisher}
          />
          <KeyValueInline
            label={<FormattedMessage id="ui-orders.itemDetails.productIds" />}
            value={line.productIdentifier}
          />
          <KeyValueInline
            label={<FormattedMessage id="ui-orders.lineListing.fundCode" />}
            value={line.fundDistribution?.map(({ code }) => code).join(', ')}
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
      render: line => line.vendorDetail?.instructions || <NoValue />,
    },
    {
      title: <FormattedMessage id="ui-orders.cost.quantityPhysical" />,
      size: 1,
      align: 'right',
      hidden: !totalQuantityPhysical,
      render: line => line.cost?.quantityPhysical,
    },
    {
      title: <FormattedMessage id="ui-orders.cost.quantityElectronic" />,
      size: 1,
      align: 'right',
      hidden: !totalQuantityElectronic,
      render: line => line.cost?.quantityElectronic,
    },
    {
      title: <FormattedMessage id="ui-orders.cost.estimatedPrice" />,
      size: 1,
      align: 'right',
      render: line => {
        return (
          <AmountWithCurrencyField
            currency={line.cost?.currency}
            amount={line.cost?.poLineEstimatedPrice}
          />
        );
      },
    },
  ];
};
