import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import POLineLocationsForm from './POLineLocationsForm';

jest.mock('../../../../common/POLFields/FieldsLocation', () => jest.fn().mockReturnValue('FieldsLocation'));

const defaultProps = {
  formValues: {},
  locations: [],
  locationIds: [],
  changeLocation: jest.fn(),
};

const renderPOLineLocationsForm = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <POLineLocationsForm
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('POLineLocationsForm', () => {
  it('should render \'POLine locations form\'', () => {
    renderPOLineLocationsForm();

    expect(screen.getByText('FieldsLocation')).toBeInTheDocument();
  });
});
