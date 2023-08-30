import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import OrderTemplateTagsView from './OrderTemplateTagsView';

const renderOrderTemplateTagsView = (props = {}) => render(
  <OrderTemplateTagsView
    {...props}
  />,
);

describe('OrderTemplateTagsView', () => {
  it('should render order template tags view', () => {
    renderOrderTemplateTagsView();

    expect(screen.getByText('ui-orders.settings.orderTemplates.editor.template.tags')).toBeInTheDocument();
  });
});
