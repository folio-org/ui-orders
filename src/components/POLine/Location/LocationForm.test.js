import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import LocationForm from './LocationForm';
import { order } from '../../../../test/jest/fixtures';

jest.mock('../../../common/POLFields/FieldsLocation', () => jest.fn().mockReturnValue('FieldsLocation'));

const defaultProps = {
  changeLocation: jest.fn(),
  locationIds: [],
  formValues: {
    isPackage: false,
  },
  order,
  initialValues: {},
  change: jest.fn(),
};

const renderLocationForm = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <LocationForm
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('EresourcesForm', () => {
  it('should render \'location form\' fields', () => {
    renderLocationForm();

    expect(screen.getByText(/FieldsLocation/i)).toBeInTheDocument();
  });
});
