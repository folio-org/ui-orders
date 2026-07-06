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

  it('should allow editing all rows and suppress delete only for System methods', () => {
    renderAcquisitionMethods();

    const { actionSuppressor } = ControlledVocab.mock.calls[0][0];

    // EditableListForm requires both keys to be callable
    expect(typeof actionSuppressor.edit).toBe('function');
    expect(typeof actionSuppressor.delete).toBe('function');

    // Edit is never suppressed (System rows must be editable to toggle the deprecated flag)
    expect(actionSuppressor.edit({ source: 'System' })).toBe(false);
    expect(actionSuppressor.edit({ source: 'User' })).toBe(false);

    // Delete is suppressed for System, allowed for User
    expect(actionSuppressor.delete({ source: 'System' })).toBe(true);
    expect(actionSuppressor.delete({ source: 'User' })).toBe(false);
  });

  it('should keep the name read-only for System methods only', () => {
    renderAcquisitionMethods();

    const { getReadOnlyFieldsForItem } = ControlledVocab.mock.calls[0][0];

    expect(getReadOnlyFieldsForItem({ source: 'System' })).toEqual(['value']);
    expect(getReadOnlyFieldsForItem({ source: 'User' })).toEqual([]);
  });
});
