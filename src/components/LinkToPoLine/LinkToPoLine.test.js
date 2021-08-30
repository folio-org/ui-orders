import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import LinkToPoLine from './LinkToPoLine';

import { orderLine } from '../../../test/jest/fixtures';

const renderLinkToPoLine = (props = {}) => render(
  <LinkToPoLine
    {...props}
  />,
  { wrapper: MemoryRouter },
);

const resources = {
  linkedPoLine: {
    records: [orderLine],
  },
};

describe('LinkToPoLine', () => {
  it('should render link to POLine', () => {
    renderLinkToPoLine({ poLineId: orderLine.id, resources });

    expect(screen.getByText(orderLine.titleOrPackage)).toBeInTheDocument();
  });

  it('should render a hypen if there is no link', () => {
    renderLinkToPoLine();

    expect(screen.getByText('-')).toBeInTheDocument();
  });
});
