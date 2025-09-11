import getOrderTemplateValue from './getOrderTemplateValue';

const orderTemplate = {
  id: 'orderTemplateUUID',
  locations: [{
    locationId: 'locationUID',
  }],
};

describe('getOrderTemplateValue', () => {
  it('should return found order template', () => {
    const actualOrderTemplate = getOrderTemplateValue(orderTemplate);

    expect(actualOrderTemplate).toEqual(orderTemplate);
  });

  it('should return empty object if order template is not found', () => {
    const actualOrderTemplate = getOrderTemplateValue({});

    expect(actualOrderTemplate).toEqual({});
  });

  it('should clear locations locationId if order template is found and no matched locations', () => {
    const actualOrderTemplate = getOrderTemplateValue(orderTemplate, { locations: [] });

    expect(actualOrderTemplate.locations[0].locationId).not.toBeDefined();
  });
});
