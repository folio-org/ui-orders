import React from 'react';
import { render, screen } from '@testing-library/react';

import { ControlledVocab } from '@folio/stripes/smart-components';

import AcquisitionMethods from './AcquisitionMethods';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  ControlledVocab: jest.fn().mockReturnValue('ControlledVocab'),
}));

const defaultProps = {
  stripes: {
    connect: () => ControlledVocab,
    hasPerm: () => true,
  },
};

const renderAcquisitionMethods = (props = {}) => render(
  <AcquisitionMethods
    {...defaultProps}
    {...props}
  />,
);

describe('AcquisitionMethods', () => {
  it('should display ControlledVocab for acq methods', () => {
    renderAcquisitionMethods();

    expect(screen.getByText('ControlledVocab')).toBeInTheDocument();
  });
});
