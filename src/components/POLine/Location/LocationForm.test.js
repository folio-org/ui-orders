import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { order } from 'fixtures';
import LocationForm from './LocationForm';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: () => 'Loading',
}));
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

describe('LocationForm', () => {
  it('should render loader when data is loading', () => {
    renderLocationForm({ isLoading: true });

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('should render \'location form\' fields', () => {
    renderLocationForm();

    expect(screen.getByText(/FieldsLocation/i)).toBeInTheDocument();
  });
});
