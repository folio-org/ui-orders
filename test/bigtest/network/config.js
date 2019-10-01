import { noop } from 'lodash';

import {
  configFunds,
  configMemberships,
  configUnits,
  configUsers,
  configVendors,
} from '@folio/stripes-acq-components/test/bigtest/network';

import {
  CHECKIN_API,
  CONFIG_API,
  INVOICE_LINES_API,
  INVOICES_API,
  ISBN_VALIDATOR,
  ITEMS_API,
  LINES_API,
  LOCATIONS_API,
  ORDER_INVOICE_RELNS_API,
  ORDER_NUMBER_API,
  ORDER_NUMBER_VALIDATE_API,
  ORDER_PIECES_API,
  ORDER_TEMPLATES_API,
  ORDERS_API,
  RECEIVE_API,
  RECEIVING_API,
} from '../../../src/components/Utils/api';
import {
  CONFIG_CLOSING_REASONS,
  MODULE_ORDERS,
} from '../../../src/components/Utils/const';

export default function config() {
  configFunds(this);
  configMemberships(this);
  configUnits(this);
  configUsers(this);
  configVendors(this);

  this.get(ORDERS_API, (schema) => {
    return schema.orders.all();
  });

  this.get(`${ORDERS_API}/:id`, (schema, request) => {
    const order = schema.orders.find(request.params.id);

    return order && order.attrs;
  });

  this.put(`${ORDERS_API}/:id`, (schema, request) => {
    const id = request.params.id;
    const attrs = JSON.parse(request.requestBody);

    return schema.orders.find(id).update(attrs);
  });

  this.post(ORDERS_API, 'order');
  this.delete(`${ORDERS_API}/:id`, 'order');
  this.get('/material-types');
  this.get('/contributor-name-types');
  this.get('/identifier-types');

  this.get(ORDER_NUMBER_API, () => {
    return { poNumber: '10001' };
  });

  this.post(ORDER_NUMBER_VALIDATE_API, noop);

  this.get(LINES_API, (schema) => {
    return schema.lines.all();
  });

  this.get(`${LINES_API}/:id`, (schema, request) => {
    return schema.lines.find(request.params.id).attrs;
  });

  this.put(`${LINES_API}/:id`, 'line');
  this.delete(`${LINES_API}/:id`, 'line');
  this.get(LOCATIONS_API);

  this.get(CONFIG_API, (schema) => {
    return schema.configs.all();
  });

  this.get(ORDER_INVOICE_RELNS_API, (schema) => {
    return schema.orderInvoiceRelationships.all();
  });
  this.get(INVOICES_API);
  this.get(INVOICE_LINES_API);

  this.get(`${CONFIG_API}/:id`, 'configs');

  this.post(CONFIG_API, (schema, request) => {
    const body = JSON.stringify(request.requestBody);

    if (body.configName === CONFIG_CLOSING_REASONS) {
      return {
        id: '042faa36-23a3-4f62-a52c-e869edb69de1',
        module: MODULE_ORDERS,
        configName: CONFIG_CLOSING_REASONS,
        code: body.code,
        enabled: true,
        value: body.value,
        metadata: {
          createdDate: '2019-04-03T10:58:40.990+0000',
          createdByUserId: '641b9c1e-7cf8-5473-bb16-7a8f13095520',
          updatedDate: '2019-04-03T10:58:40.990+0000',
          updatedByUserId: '641b9c1e-7cf8-5473-bb16-7a8f13095520',
        },
      };
    }

    return {};
  });
  this.put(`${CONFIG_API}/:id`, noop);
  this.delete(`${CONFIG_API}/:id`, noop);

  this.get(RECEIVING_API, (schema) => {
    return schema.pieces.all();
  });

  this.get(ITEMS_API, ({ items }) => items.all());

  this.post(ORDER_PIECES_API, (schema, request) => {
    const body = JSON.stringify(request.requestBody);

    return {
      id: body.id,
      caption: body.caption,
      comment: body.comment,
      format: body.format,
      locationId: body.locationId,
      poLineId: body.poLineId,
      receivingStatus: body.receivingStatus,
    };
  });

  this.delete(`${ORDER_PIECES_API}/:id`, 'piece');

  this.post(CHECKIN_API, (schema, request) => {
    const body = JSON.stringify(request.requestBody);

    return {
      receivingResults: [{
        poLineId: body.poLineId,
        processedSuccessfully: 1,
        processedWithError: 0,
        receivingItemResults: [{
          pieceId: body.pieceId,
          processingStatus: {
            type: 'success',
          },
        }],
      }],
      totalRecords: 1,
    };
  });

  this.post(RECEIVE_API, (schema, request) => {
    const body = JSON.stringify(request.requestBody);

    return {
      receivingResults: [{
        poLineId: body.poLineId,
        processedSuccessfully: 1,
        processedWithError: 0,
        receivingItemResults: [{
          pieceId: body.pieceId,
          processingStatus: {
            type: 'success',
          },
        }],
      }],
      totalRecords: 1,
    };
  });

  this.get(ORDER_TEMPLATES_API, (schema) => {
    return schema.orderTemplates.all();
  });

  this.get(`${ORDER_TEMPLATES_API}/:id`, (schema, request) => {
    return request.params.id
      ? schema.orderTemplates.find(request.params.id).attrs
      : null;
  });

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
}
