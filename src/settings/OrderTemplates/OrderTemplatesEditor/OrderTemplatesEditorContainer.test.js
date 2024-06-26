import { Form } from 'react-final-form';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useLocationsQuery } from '@folio/stripes-acq-components';

import { location } from 'fixtures';
import { getCommonErrorMessage } from '../../../common/utils';
import OrderTemplatesEditorContainer from './OrderTemplatesEditorContainer';
import OrderTemplatesEditor from './OrderTemplatesEditor';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useCentralOrderingContext: jest.fn(() => ({ isCentralOrderingEnabled: false })),
  useLocationsQuery: jest.fn(),
}));
jest.mock('../../../common/utils', () => ({
  ...jest.requireActual('../../../common/utils'),
  getCommonErrorMessage: jest.fn(),
}));
jest.mock('./OrderTemplatesEditor', () => jest.fn().mockReturnValue('OrderTemplatesEditor'));

const defaultProps = {
  close: jest.fn(),
  resources: {
    identifierTypes: {
      records: [{
        id: 'typeId',
        name: 'ISBN',
      }],
    },
    contributorNameTypes: {
      records: [{
        id: 'contributorId',
        name: 'contributorName',
      }],
    },
    fund: {
      records: [{
        id: 'fundId',
        name: 'fundName',
        code: 'fundCode',
      }],
    },
    createInventory: {
      records: [{
        value: {},
      }],
    },
    vendors: {
      records: [{
        isVendor: true,
        status: 'Active',
        accounts: [{
          name: 'accountName',
          accountNo: 'accountNo',
        }],
      }],
    },
    prefixesSetting: {
      records: [{
        name: 'prefixName',
      }],
    },
    suffixesSetting: {
      records: [{
        name: 'suffixName',
      }],
    },
  },
  mutator: {
    orderTemplate: {
      PUT: jest.fn().mockResolvedValue([]),
      POST: jest.fn().mockResolvedValue([]),
    },
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

const renderOrderTemplatesEditorContainer = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <OrderTemplatesEditorContainer
        {...defaultProps}
        {...props}
      />
    )}
  />,
  { wrapper },
);

describe('OrderTemplatesEditorContainer', () => {
  beforeEach(() => {
    useLocationsQuery
      .mockClear()
      .mockReturnValue({ locations: [location] });
  });

  it('should render order templates editor', async () => {
    renderOrderTemplatesEditorContainer();

    const editor = await screen.findByText('OrderTemplatesEditor');

    expect(editor).toBeInTheDocument();
  });

  it('should save template when form was submitted', async () => {
    renderOrderTemplatesEditorContainer();

    await waitFor(() => OrderTemplatesEditor.mock.calls[0][0].onSubmit({
      templateName: 'aaa',
    }));

    expect(defaultProps.mutator.orderTemplate.POST).toHaveBeenCalled();
  });

  describe('OrderTemplatesEditorContainer error handling', () => {
    beforeEach(() => {
      getCommonErrorMessage.mockClear();
    });

    it('should handle error on save template', async () => {
      defaultProps.mutator.orderTemplate.POST.mockRejectedValue();

      renderOrderTemplatesEditorContainer();

      await waitFor(() => OrderTemplatesEditor.mock.calls[0][0].onSubmit({
        templateName: 'aaa',
      }));

      expect(getCommonErrorMessage).toHaveBeenCalled();
    });
  });
});
