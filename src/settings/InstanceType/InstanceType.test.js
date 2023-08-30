import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import InstanceType from './InstanceType';

jest.mock('@folio/stripes-smart-components/lib/ConfigManager', () => jest.fn(({ children }) => <>{children}</>));
jest.mock('./InstanceTypeForm', () => jest.fn().mockReturnValue('InstanceTypeForm'));

const defaultProps = {
  stripes: {
    connect: (component) => component,
  },
  label: {},
  resources: {},
};

const renderInstanceType = (props = {}) => render(
  <InstanceType
    {...defaultProps}
    {...props}
  />,
);

describe('InstanceType', () => {
  it('should display settings', () => {
    renderInstanceType();

    expect(screen.getByText('InstanceTypeForm')).toBeInTheDocument();
  });
});
