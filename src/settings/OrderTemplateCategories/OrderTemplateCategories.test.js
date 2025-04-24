import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { OrderTemplateCategories } from './OrderTemplateCategories';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  TitleManager: jest.fn(({ children }) => <div>{children}</div>),
  stripesConnect: jest.fn((component) => component),
  useStripes: jest.fn(() => ({
    hasPerm: jest.fn(() => true),
  })),
}));
jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  ControlledVocab: jest.fn(({ actionSuppressor }) => {
    actionSuppressor?.edit?.();
    actionSuppressor?.delete?.();

    return <div>ControlledVocab</div>;
  }),
}));

const defaultProps = {};

const renderOrderTemplateCategories = (props = {}) => render(
  <OrderTemplateCategories
    {...defaultProps}
    {...props}
  />,
);

describe('OrderTemplateCategories', () => {
  it('should display ControlledVocab for orders template categories', () => {
    renderOrderTemplateCategories();

    expect(screen.getByText('ControlledVocab')).toBeInTheDocument();
  });
});
