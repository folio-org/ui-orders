import React from 'react';
import { render, screen } from '@testing-library/react';

import { AcquisitionMethods } from './AcquisitionMethods';
import AcquisitionMethodsContainer from './AcquisitionMethodsContainer';

jest.mock('./AcquisitionMethods', () => ({
  AcquisitionMethods: jest.fn().mockReturnValue('AcquisitionMethods'),
}));
jest.mock('./utils');

const defaultProps = {
  resources: {
    values: {
      records: [{ id: 'id', name: 'name' }],
      isPending: false,
    },
  },
  mutator: {
    values: {
      GET: jest.fn(),
      POST: jest.fn(),
      PUT: jest.fn(),
      DELETE: jest.fn(),
    },
    activeRecord: {
      update: jest.fn(),
    },
  },
};

const renderAcquisitionMethodsContainer = (props = {}) => render(
  <AcquisitionMethodsContainer
    {...defaultProps}
    {...props}
  />,
);

describe('AcquisitionMethodsContainer', () => {
  beforeEach(() => {
    defaultProps.mutator.values.POST.mockClear();
    defaultProps.mutator.values.PUT.mockClear();
  });

  it('should render AcquisitionMethods', () => {
    renderAcquisitionMethodsContainer();

    expect(screen.getByText('AcquisitionMethods')).toBeInTheDocument();
  });

  it('should call POST method when creating a new acq method', () => {
    renderAcquisitionMethodsContainer();

    AcquisitionMethods.mock.calls[0][0].onCreate();

    expect(defaultProps.mutator.values.POST).toHaveBeenCalled();
  });

  it('should call PUT method when updating an acq method', () => {
    renderAcquisitionMethodsContainer();

    AcquisitionMethods.mock.calls[0][0].onUpdate();

    expect(defaultProps.mutator.values.PUT).toHaveBeenCalled();
  });
});
