import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import { UPDATE_HOLDINGS_OPERATIONS_MAP } from '../constants';
import { useChangeInstanceModalConfigs } from '../hooks';
import { ChangeInstanceModalContainer } from './ChangeInstanceModalContainer';

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useChangeInstanceModalConfigs: jest.fn(() => ({})),
}));
jest.mock('../RelatedItemsList', () => ({
  RelatedItemsList: jest.fn(() => 'RelatedItemsList'),
}));

const defaultProps = {
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
  poLine: {
    instanceId: 'instanceId',
    titleOrPackage: 'Old instance title',
  },
  selectedInstance: {
    id: 'newInstanceId',
    title: 'New instance title',
  },
};

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </MemoryRouter>
);

const renderChangeInstanceModal = (props = {}) => render(
  <ChangeInstanceModalContainer
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('ChangeInstanceModalContainer', () => {
  const mockModalConfigs = {
    holdingsConfigs: {
      relatedToAnother: false,
      willAbandoned: false,
    },
    isDetailed: false,
    isLoading: false,
  };

  beforeEach(() => {
    defaultProps.onCancel.mockClear();
    defaultProps.onSubmit.mockClear();
    useChangeInstanceModalConfigs
      .mockClear()
      .mockReturnValue(mockModalConfigs);
  });

  describe('Default change instance confirmation modal:', () => {
    beforeEach(() => {
      renderChangeInstanceModal();
    });

    it('should render default confirmation modal', () => {
      expect(screen.getByText('ui-orders.line.changeInstance.heading')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.line.changeInstance.message')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.line.changeInstance.confirmLabel')).toBeInTheDocument();
    });

    it('should call \'onCancel\' when \'Cancel\' button was clicked', () => {
      user.click(screen.getByText('ui-orders.buttons.line.cancel'));

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    it('should call \'onSubmit\' when \'Confirm\' button was clicked', () => {
      user.click(screen.getByText('ui-orders.line.changeInstance.confirmLabel'));

      expect(defaultProps.onSubmit).toHaveBeenCalled();
    });
  });

  describe('Detailed change instance confirmation modal:', () => {
    const getDetailedModalConfigs = (holdingsConfigs = {}) => ({
      ...mockModalConfigs,
      holdingsConfigs: {
        ...mockModalConfigs.holdingsConfigs,
        ...holdingsConfigs,
      },
      isDetailed: true,
    });

    beforeEach(() => {
      useChangeInstanceModalConfigs
        .mockClear()
        .mockReturnValue(getDetailedModalConfigs());
    });

    it('should render detailed confirmation modal', () => {
      renderChangeInstanceModal();

      expect(screen.getByText('ui-orders.line.changeInstance.heading')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.line.changeInstance.detailedMessage')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.buttons.line.submit')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.line.changeInstance.holdingOperations.field')).toBeInTheDocument();
      expect(screen.getByText('RelatedItemsList')).toBeInTheDocument();
    });

    describe('Delete holdings modal:', () => {
      const renderConfigured = () => {
        renderChangeInstanceModal();

        user.selectOptions(
          screen.getByLabelText(/ui-orders.line.changeInstance.holdingOperations.field/),
          [UPDATE_HOLDINGS_OPERATIONS_MAP.create],
        );
        user.click(screen.getByText('ui-orders.buttons.line.submit'));
      };

      it('should NOT render modal if related holding(s) contain another piece(s)/item(s)', () => {
        renderConfigured();

        expect(screen.queryByText('stripes-acq-components.holdings.deleteModal.message')).not.toBeInTheDocument();
      });

      describe('when related holding(s) will be abandoned after instance changing:', () => {
        beforeEach(() => {
          useChangeInstanceModalConfigs
            .mockClear()
            .mockReturnValue(getDetailedModalConfigs({ willAbandoned: true }));

          renderConfigured();
        });

        it('should render \'Delete holdings\' modal', () => {
          expect(screen.getByText('stripes-acq-components.holdings.deleteModal.message')).toBeInTheDocument();
        });

        it('should call \'onSubmit\' without deletion flag when \'Keep holdings\' button was clicked', () => {
          user.click(screen.getByText('stripes-acq-components.holdings.deleteModal.keepHoldings'));

          expect(defaultProps.onSubmit).toHaveBeenCalledWith({
            holdingsOperation: UPDATE_HOLDINGS_OPERATIONS_MAP.create,
          });
        });

        it('should call \'onSubmit\' with deletion flag when \'Delete holdings\' button was clicked', () => {
          user.click(screen.getByRole('button', {
            name: 'stripes-acq-components.holdings.deleteModal.heading',
          }));

          expect(defaultProps.onSubmit).toHaveBeenCalledWith(expect.objectContaining({
            deleteAbandonedHoldings: true,
          }));
        });
      });
    });
  });
});
