import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import TemplateInformationView from './TemplateInformationView';

const renderTemplateInformationView = (props = {}) => render(
  <TemplateInformationView
    {...props}
  />,
);

describe('TemplateInformationView', () => {
  it('should render template information view', () => {
    renderTemplateInformationView();

    expect(screen.getByText('ui-orders.settings.orderTemplates.editor.template.name')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.settings.orderTemplates.editor.template.code')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.settings.orderTemplates.editor.template.description')).toBeInTheDocument();
  });
});
