import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import OrderTemplatesList from './OrderTemplatesList';

const defaultProps = {
  label: <>Label</>,
  orderTemplatesList: [{
    id: 'templateId',
    templateName: 'templateName',
  }],
  rootPath: '',
};

const renderOrderTemplatesList = (props = {}) => render(
  <OrderTemplatesList
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('OrderTemplatesList', () => {
  it('should render templates links', () => {
    renderOrderTemplatesList();

    expect(screen.getByText(defaultProps.orderTemplatesList[0].templateName)).toBeInTheDocument();
  });
});
