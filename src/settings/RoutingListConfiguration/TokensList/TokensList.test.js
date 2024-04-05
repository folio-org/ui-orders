import { render } from '@folio/jest-config-stripes/testing-library/react';

import { ROUTING_LIST_TOKEN } from '../constants';
import TokensList from './TokensList';

jest.mock('@folio/stripes-template-editor', () => ({
  TokensSection: jest.fn(() => null),
}));

describe('View TokensList', () => {
  const mockedOnLoopSelect = jest.fn();
  const mockedOnSectionInit = jest.fn();
  const mockedOnTokenSelect = jest.fn();
  const selectedCategory = 'Loan';
  const defaultProps = {
    selectedCategory,
    tokens: ROUTING_LIST_TOKEN,
    onLoopSelect: mockedOnLoopSelect,
    onSectionInit: mockedOnSectionInit,
    onTokenSelect: mockedOnTokenSelect,
  };

  it('should render TokensList component', () => {
    const { getByTestId } = render(
      <TokensList {...defaultProps} />,
    );

    expect(getByTestId('tokenListWrapper')).toBeInTheDocument();
  });
});
