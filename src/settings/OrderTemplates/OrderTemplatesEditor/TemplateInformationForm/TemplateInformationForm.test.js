import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import TemplateInformationForm from './TemplateInformationForm';

const renderTemplateInformationForm = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <TemplateInformationForm
        {...props}
      />
    )}
  />,
);

describe('TemplateInformationForm', () => {
  it('should render \'Template information form\' fields', () => {
    renderTemplateInformationForm();

    expect(screen.getByText('ui-orders.settings.orderTemplates.editor.template.name')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.settings.orderTemplates.editor.template.code')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.settings.orderTemplates.editor.template.description')).toBeInTheDocument();
  });
});
