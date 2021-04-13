import React from 'react';
import { FormattedMessage } from 'react-intl';

export const LINE_FIELDS_MAP = {
  poLineNumber: 'poLineNumber',
  poLineDescription: 'poLineDescription',
  quantityPhysical: 'cost.quantityPhysical',
  quantityElectronic: 'cost.quantityElectronic',
  currency: 'cost.currency',
  listUnitPrice: 'cost.listUnitPrice',
  listUnitPriceElectronic: 'cost.listUnitPriceElectronic',
  additionalCost: 'cost.additionalCost',
  discount: 'cost.discount',
  poLineEstimatedPrice: 'cost.poLineEstimatedPrice',
  fundDistribution: 'fundDistribution',
  productIds: 'productIdentifier',
  materialTypePhysical: 'materialType',
  materialTypeE: 'materialTypeE',
  acquisitionMethod: 'acquisitionMethod',
  titleOrPackage: 'titleOrPackage',
  publicationDate: 'publicationDate',
  publisher: 'publisher',
  rush: 'rush',
  vendorAccount: 'vendorDetail.vendorAccount',
  // instructions: 'vendorDetail.instructions',
};

export const LINE_FIELDS_LABELS = {
  [LINE_FIELDS_MAP.poLineNumber]: <FormattedMessage id="ui-orders.poLine.number" />,
  [LINE_FIELDS_MAP.poLineDescription]: <FormattedMessage id="ui-orders.poLine.poLineDescription" />,
  [LINE_FIELDS_MAP.quantityPhysical]: <FormattedMessage id="ui-orders.cost.quantityPhysical" />,
  [LINE_FIELDS_MAP.quantityElectronic]: <FormattedMessage id="ui-orders.cost.quantityElectronic" />,
  [LINE_FIELDS_MAP.currency]: <FormattedMessage id="ui-orders.cost.currency" />,
  [LINE_FIELDS_MAP.listUnitPrice]: <FormattedMessage id="ui-orders.cost.listPrice" />,
  [LINE_FIELDS_MAP.listUnitPriceElectronic]: <FormattedMessage id="ui-orders.cost.unitPriceOfElectronic" />,
  [LINE_FIELDS_MAP.additionalCost]: <FormattedMessage id="ui-orders.cost.additionalCost" />,
  [LINE_FIELDS_MAP.discount]: <FormattedMessage id="ui-orders.cost.discount" />,
  [LINE_FIELDS_MAP.poLineEstimatedPrice]: <FormattedMessage id="ui-orders.cost.estimatedPrice" />,
  [LINE_FIELDS_MAP.fundDistribution]: <FormattedMessage id="ui-orders.poLine.fundDistribution" />,
  [LINE_FIELDS_MAP.productIds]: <FormattedMessage id="ui-orders.itemDetails.productId" />,
  [LINE_FIELDS_MAP.materialTypePhysical]: <FormattedMessage id="ui-orders.filter.materialType.physical" />,
  [LINE_FIELDS_MAP.materialTypeE]: <FormattedMessage id="ui-orders.filter.materialType.electronic" />,
  [LINE_FIELDS_MAP.acquisitionMethod]: <FormattedMessage id="ui-orders.poLine.acquisitionMethod" />,
  [LINE_FIELDS_MAP.titleOrPackage]: <FormattedMessage id="ui-orders.orderLineList.titleOrPackage" />,
  [LINE_FIELDS_MAP.publicationDate]: <FormattedMessage id="ui-orders.itemDetails.publicationDate" />,
  [LINE_FIELDS_MAP.publisher]: <FormattedMessage id="ui-orders.itemDetails.publisher" />,
  [LINE_FIELDS_MAP.rush]: <FormattedMessage id="ui-orders.poLine.rush" />,
  [LINE_FIELDS_MAP.vendorAccount]: <FormattedMessage id="ui-orders.search.vendorDetail.vendorAccount" />,
  'vendorDetail.instructions': <FormattedMessage id="ui-orders.vendor.instructions" />,
};