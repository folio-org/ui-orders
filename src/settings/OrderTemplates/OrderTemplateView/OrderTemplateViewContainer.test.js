import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import OrderTemplateViewContainer from './OrderTemplateViewContainer';
import OrderTemplateView from './OrderTemplateView';
import { getCommonErrorMessage } from '../../../common/utils';

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
      POST: jest.fn().mockResolvedValue(),
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

describe('OrderTemplateViewContainer', () => {
  it('should render order template view', () => {
    renderOrderTemplateViewContainer();

    expect(screen.getByText('OrderTemplateView')).toBeInTheDocument();
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

    it('should handle error on delete template', async () => {
      defaultProps.mutator.orderTemplate.DELETE.mockRejectedValue();

      renderOrderTemplateViewContainer();

      await waitFor(() => OrderTemplateView.mock.calls[0][0].onDelete());

      expect(getCommonErrorMessage).toHaveBeenCalled();
    });
  });
});
