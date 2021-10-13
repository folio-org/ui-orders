import React from 'react';
import { render, screen } from '@testing-library/react';

import { ConfigManager } from '@folio/stripes/smart-components';

import InstanceMatching from './InstanceMatching';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  ConfigManager: jest.fn(({ children }) => <>{children}</>),
}));
jest.mock('./InstanceMatchingForm', () => ({
  InstanceMatchingForm: jest.fn().mockReturnValue('InstanceMatchingForm')
}));

const defaultProps = {
  label: 'label',
  stripes: {
    connect: () => ConfigManager,
  },
};

const renderInstanceMatching = (props = {}) => render(
  <InstanceMatching
    {...defaultProps}
    {...props}
  />,
);

describe('InstanceMatching', () => {
  it('should render \'instance matching\' form', () => {
    renderInstanceMatching();

    expect(screen.getByText('InstanceMatchingForm')).toBeInTheDocument();
  });

  describe('beforeSave', () => {
    it('should return JSON string', () => {
      renderInstanceMatching();

      const values = ConfigManager.mock.calls[0][0].onBeforeSave({ isInstanceMatchingDisabled: true });

      expect(typeof values).toBe('string');
    });
  });
});
