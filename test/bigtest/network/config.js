import { noop } from 'lodash';

import {
  configFunds,
  configMemberships,
  configUnits,
  configUsers,
  configVendors,
  configTags,
  createGetById,
  configLocations,
  configMaterialTypes,
  configLines,
} from '@folio/stripes-acq-components/test/bigtest/network';

import {
  CONFIG_API,
  INVOICE_LINES_API,
  INVOICES_API,
  ISBN_VALIDATOR,
  ORDER_INVOICE_RELNS_API,
  ORDER_NUMBER_API,
  ORDER_NUMBER_VALIDATE_API,
  ORDER_TEMPLATES_API,
  RECEIVING_API,
} from '../../../src/components/Utils/api';
import {
  configClosingReasons,
  configOrders,
  configPrefixes,
  configSuffixes,
} from './configs';

export default function config() {
  configFunds(this);
  configMemberships(this);
  configUnits(this);
  configUsers(this);
  configVendors(this);
  configTags(this);
  configOrders(this);
  configLines(this);
  configLocations(this);
  configMaterialTypes(this);
  configClosingReasons(this);
  configSuffixes(this);
  configPrefixes(this);

  this.get('/contributor-name-types');
  this.get('/identifier-types');

  this.get(ORDER_NUMBER_API, () => {
    return { poNumber: '10001' };
  });

  this.post(ORDER_NUMBER_VALIDATE_API, noop);

  this.get(CONFIG_API, (schema) => {
    return schema.configs.all();
  });

  this.get(ORDER_INVOICE_RELNS_API, (schema) => {
    return schema.orderInvoiceRelationships.all();
  });
  this.get(INVOICES_API);
  this.get(INVOICE_LINES_API);

  this.get(`${CONFIG_API}/:id`, 'config');

  this.post(CONFIG_API, noop);
  this.put(`${CONFIG_API}/:id`, noop);
  this.delete(`${CONFIG_API}/:id`, noop);

  this.get(RECEIVING_API, (schema) => {
    return schema.pieces.all();
  });

  this.get(ORDER_TEMPLATES_API, (schema) => {
    return schema.orderTemplates.all();
  });

  this.get(`${ORDER_TEMPLATES_API}/:id`, createGetById('orderTemplates'));

  this.put(`${ORDER_TEMPLATES_API}/:id`, (schema, request) => {
    const id = request.params.id;
    const attrs = JSON.parse(request.requestBody);

    schema.orderTemplates.find(id).update(attrs);

    return null;
  });

  this.post(ORDER_TEMPLATES_API, (schema, request) => {
    const attrs = JSON.parse(request.requestBody) || {};

    return schema.orderTemplates.create(attrs);
  });

  this.delete(`${ORDER_TEMPLATES_API}/:id`, 'orderTemplates');

  this.get('/isbn/convertTo13', () => {
    return { isbn: '1234567890123' };
  });

  this.get(ISBN_VALIDATOR, () => {
    return { isValid: true };
  });

  this.get('/note-types');
  this.get('/notes/:id', ({ notes }, { params }) => {
    return notes.find(params.id);
  });
  this.get('/note-links/domain/orders/type/:type/id/:id', ({ notes }, { params, queryParams }) => {
    if (queryParams.status === 'all') {
      return notes.all();
    }

    return notes.where(note => note.links.some(link => {
      return link.type === params.type && link.id === params.id;
    }));
  });
}
