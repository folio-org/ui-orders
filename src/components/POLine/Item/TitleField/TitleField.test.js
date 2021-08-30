import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import TitleField from './TitleField';
import { orderLine } from '../../../../../test/jest/fixtures';

const defaultProps = {
  poLineDetails: orderLine,
};

const renderTitleField = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <TitleField
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('TitleField', () => {
  it('should render \'title\' view if the field is non-interactive', () => {
    renderTitleField({ isNonInteractive: true });

    expect(screen.getByText(orderLine.titleOrPackage)).toBeInTheDocument();
  });

  it('should render \'title\' if the field is interactive', () => {
    renderTitleField({ isNonInteractive: false });

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
