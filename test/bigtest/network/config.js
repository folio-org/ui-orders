// typical mirage config export
// http://www.ember-cli-mirage.com/docs/v0.4.x/configuration/
import { noop } from 'lodash';
import {
  CHECKIN_API,
  CONFIG_API,
  FUND_API,
  INVOICE_LINES_API,
  INVOICES_API,
  ITEMS_API,
  LINES_API,
  LOCATIONS_API,
  ORDER_INVOICE_RELNS_API,
  ORDER_NUMBER_API,
  ORDER_NUMBER_VALIDATE_API,
  ORDER_PIECES_API, ORDER_TEMPLATE_DETAIL_API, ORDER_TEMPLATES_API,
  ORDERS_API,
  RECEIVE_API,
  RECEIVING_API,
  VENDORS_API,
} from '../../../src/components/Utils/api';
import {
  CONFIG_CLOSING_REASONS,
  MODULE_ORDERS,
} from '../../../src/components/Utils/const';
import { BUDGETS_API } from '../../../../ui-finance/src/common/const';

export default function config() {
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

  this.get(VENDORS_API, (schema) => {
    return schema.vendors.all();
  });

  this.get(FUND_API);
  this.get('/users');
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

  this.get(VENDORS_API, (schema) => {
    return schema.vendors.all();
  });

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
}
