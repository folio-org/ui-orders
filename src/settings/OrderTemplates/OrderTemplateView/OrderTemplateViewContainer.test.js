import { MemoryRouter } from 'react-router';

import { render, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { getCommonErrorMessage } from '../../../common/utils';
import OrderTemplateViewContainer from './OrderTemplateViewContainer';
import OrderTemplateView from './OrderTemplateView';

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: jest.fn(() => ({
    formatMessage: (v) => v,
    formatDate: (v) => v,
  })),
}));
jest.mock('../../../common/utils', () => ({
  ...jest.requireActual('../../../common/utils'),
  getCommonErrorMessage: jest.fn(),
}));
jest.mock('./OrderTemplateView', () => jest.fn().mockReturnValue('OrderTemplateView'));

const defaultProps = {
  close: jest.fn(),
  showSuccessDeleteMessage: jest.fn(),
  rootPath: '',
  mutator: {
    orderTemplate: {
      DELETE: jest.fn().mockResolvedValue(),
      PUT: jest.fn().mockResolvedValue(),
      POST: jest.fn().mockResolvedValue({ id: 'id' }),
    },
  },
  resources: {},
};

const renderOrderTemplateViewContainer = (props = {}) => render(
  <OrderTemplateViewContainer
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

const template = {
  id: 'order-template-id',
  templateName: 'Test',
};

describe('OrderTemplateViewContainer', () => {
  it('should render order template view', () => {
    renderOrderTemplateViewContainer();

    expect(screen.getByText('OrderTemplateView')).toBeInTheDocument();
  });

  it('should duplicate template when \'Duplicate\' action was called', async () => {
    renderOrderTemplateViewContainer();

    await waitFor(() => OrderTemplateView.mock.calls[0][0].onDuplicate(template));

    expect(defaultProps.mutator.orderTemplate.POST).toHaveBeenCalled();
  });

  it('should delete template when such action was called', async () => {
    renderOrderTemplateViewContainer();

    await waitFor(() => OrderTemplateView.mock.calls[0][0].onDelete());

    expect(defaultProps.mutator.orderTemplate.DELETE).toHaveBeenCalled();
  });

  describe('OrderTemplateViewContainer error handling', () => {
    beforeEach(() => {
      getCommonErrorMessage.mockClear();
    });

    it('should handle error on duplicate template', async () => {
      defaultProps.mutator.orderTemplate.POST.mockRejectedValue();

      renderOrderTemplateViewContainer();

      await waitFor(() => OrderTemplateView.mock.calls[0][0].onDuplicate(template));

      expect(getCommonErrorMessage).toHaveBeenCalled();
    });

    it('should handle error on delete template', async () => {
      defaultProps.mutator.orderTemplate.DELETE.mockRejectedValue();

      renderOrderTemplateViewContainer();

      await waitFor(() => OrderTemplateView.mock.calls[0][0].onDelete());

      expect(getCommonErrorMessage).toHaveBeenCalled();
    });
  });
});
