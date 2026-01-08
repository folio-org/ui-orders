import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { EresourcesVersionView } from './EresourcesVersionView';

const mockVersion = {
  eresource: {
    accessProvider: 'Test Provider',
    activated: true,
    activationDue: 30,
    createInventory: 'Instance, Holding, Item',
    materialType: 'Electronic Resource',
    trial: false,
    expectedActivation: '2024-01-15',
    userLimit: 100,
    resourceUrl: 'https://example.com/resource',
  },
  order: {
    metadata: {
      createdDate: '2024-01-01T00:00:00.000Z',
    },
  },
};

const renderEresourcesVersionView = (props = {}) => render(
  <EresourcesVersionView
    version={mockVersion}
    {...props}
  />,
);

describe('EresourcesVersionView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render access provider', () => {
    renderEresourcesVersionView();

    expect(screen.getByText('Test Provider')).toBeInTheDocument();
  });

  it('should render activation status checkbox', () => {
    renderEresourcesVersionView();

    const checkbox = screen.getByRole('checkbox', { name: /activationStatus/i });

    expect(checkbox).toBeChecked();
  });

  it('should render create inventory value', () => {
    renderEresourcesVersionView();

    expect(screen.getByText('Instance, Holding, Item')).toBeInTheDocument();
  });

  it('should render material type', () => {
    renderEresourcesVersionView();

    expect(screen.getByText('Electronic Resource')).toBeInTheDocument();
  });

  it('should render trial checkbox as unchecked', () => {
    renderEresourcesVersionView();

    const checkbox = screen.getByRole('checkbox', { name: /trial/i });

    expect(checkbox).not.toBeChecked();
  });

  it('should render expected activation date', () => {
    renderEresourcesVersionView();

    expect(screen.getByText('2024-01-15')).toBeInTheDocument();
  });

  it('should render user limit', () => {
    renderEresourcesVersionView();

    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('should render resource URL as a link', () => {
    renderEresourcesVersionView();

    const link = screen.getByRole('link', { name: 'https://example.com/resource' });

    expect(link).toHaveAttribute('href', 'https://example.com/resource');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should handle missing eresource data', () => {
    const versionWithoutEresource = { order: {} };

    render(<EresourcesVersionView version={versionWithoutEresource} />);

    expect(screen.queryByText('Test Provider')).not.toBeInTheDocument();
  });

  it('should not render link when resourceUrl is not provided', () => {
    const versionWithoutUrl = {
      ...mockVersion,
      eresource: {
        ...mockVersion.eresource,
        resourceUrl: null,
      },
    };

    renderEresourcesVersionView({ version: versionWithoutUrl });

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
