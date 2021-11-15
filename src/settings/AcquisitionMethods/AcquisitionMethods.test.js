import React from 'react';
import { render, screen } from '@testing-library/react';

import { AcquisitionMethods } from './AcquisitionMethods';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  EditableList: jest.fn().mockReturnValue('EditableList'),
}));

const defaultProps = {
  contentData: [{ name: 'Name', id: 'id' }],
  onDelete: jest.fn(),
  onCreate: jest.fn(),
  onUpdate: jest.fn(),
  validate: jest.fn(),
  isPending: false,
  label: 'Label',
};

const renderAcquisitionMethods = (props = {}) => render(
  <AcquisitionMethods
    {...defaultProps}
    {...props}
  />,
);

describe('AcquisitionMethods', () => {
  it('should display EditableList', () => {
    renderAcquisitionMethods();

    expect(screen.getByText('EditableList')).toBeInTheDocument();
  });
});
