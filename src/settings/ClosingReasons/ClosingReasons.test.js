import React from 'react';
import { render, screen } from '@testing-library/react';

import { ControlledVocab } from '@folio/stripes/smart-components';

import ClosingReasons from './ClosingReasons';

jest.mock('@folio/stripes-smart-components/lib/ControlledVocab', () => jest.fn().mockReturnValue('ControlledVocab'));

const defaultProps = {
  stripes: {
    connect: (component) => component,
  },
};

const renderClosingReasons = (props = {}) => render(
  <ClosingReasons
    {...defaultProps}
    {...props}
  />,
);

describe('ClosingReasons', () => {
  it('should display settings', () => {
    renderClosingReasons();

    expect(screen.getByText('ControlledVocab')).toBeInTheDocument();
  });

  it('should check suppressoor', () => {
    renderClosingReasons();

    expect(ControlledVocab.mock.calls[0][0].actionSuppressor.edit({ source: 'User' })).toBeFalsy();
    expect(ControlledVocab.mock.calls[0][0].actionSuppressor.delete({ source: 'System' })).toBeTruthy();
  });

  it('should return formatted value', () => {
    renderClosingReasons();

    expect(ControlledVocab.mock.calls[0][0].formatter.reason({ reason: 'Some reason' })).toBe('Some reason');
    expect(ControlledVocab.mock.calls[0][0].formatter.source({})).toBe('-');
  });
});
