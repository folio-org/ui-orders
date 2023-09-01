import { FormattedMessage } from 'react-intl';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { ControlledVocab } from '@folio/stripes/smart-components';
import { ACQUISITION_METHOD } from '@folio/stripes-acq-components';

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

  it('formatter should return formatted message with acq method value', () => {
    renderAcquisitionMethods();

    expect(ControlledVocab.mock.calls[0][0].formatter.value({ value: ACQUISITION_METHOD.purchase })).toEqual(
      <FormattedMessage
        id="stripes-acq-components.acquisition_method.purchase"
        defaultMessage={ACQUISITION_METHOD.purchase}
      />,
    );
  });
});
