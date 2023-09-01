import { MemoryRouter, useHistory } from 'react-router';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { HasCommand } from '@folio/stripes/components';

import OrderTemplatesList from './OrderTemplatesList';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn(),
}));
jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
}));

const defaultProps = {
  label: <>Label</>,
  orderTemplatesList: [{
    id: 'templateId',
    templateName: 'templateName',
  }],
  rootPath: '',
};

const renderOrderTemplatesList = (props = {}) => render(
  <OrderTemplatesList
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('OrderTemplatesList', () => {
  it('should render templates links', () => {
    renderOrderTemplatesList();

    expect(screen.getByText(defaultProps.orderTemplatesList[0].templateName)).toBeInTheDocument();
  });

  describe('Shortcuts', () => {
    beforeEach(() => {
      HasCommand.mockClear();
    });

    it('should navigate to new form when new shortcut is called', () => {
      const pushMock = jest.fn();

      useHistory.mockClear().mockReturnValue({
        push: pushMock,
      });

      renderOrderTemplatesList();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'new').handler();

      expect(pushMock).toHaveBeenCalledWith(`${defaultProps.rootPath}/create`);
    });
  });
});
