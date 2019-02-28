// typical mirage config export
// http://www.ember-cli-mirage.com/docs/v0.4.x/configuration/
import {
  LINES_API,
  ORDER_NUMBER_API,
  ORDERS_API,
  VENDORS_API,
  RECEIVING_API,
} from '../../../src/components/Utils/api';

export default function config() {
  this.get(ORDERS_API, (schema) => {
    return schema.orders.all();
  });

  this.get(`${ORDERS_API}/:id`, (schema, request) => {
    return schema.orders.find(request.params.id).attrs;
    // return {
    //   ...schema.orders.find(request.params.id).attrs,
    //   po_lines: [{ cost: { quantity_physical: 2 } }],
    // };
  });

  this.get(VENDORS_API, (schema) => {
    return schema.vendors.all();
  });

  this.get('/fund');
  this.get('/users');
  this.get('/material-types');

  this.get(ORDER_NUMBER_API, () => {
    return { poNumber: '10001' };
  });

  this.get(LINES_API, (schema) => {
    return schema.lines.all();
  });

  this.get('/locations');

  this.get('/configurations/entries', (_, { queryParams }) => {
    return queryParams && queryParams.query === '(module=ORDERS and configName=orderNumber)'
      ? {
        configs: [{
          id: '7c7c5a09-d465-4642-889a-8a0b351d7b15',
          module: 'ORDERS',
          configName: 'orderNumber',
          enabled: true,
          value: '{"canUserEditOrderNumber":false,"selectedPrefixes":["PP"],"prefixes":["PP1","PP2","PP3","PP"],"selectedSuffixes":["SS"],"suffixes":["SS1","SS2","SS"]}',
        }],
      } : { configs: [] };
  });

  this.get(RECEIVING_API, (schema) => {
    return schema.pieces.all();
  });
}
