import { MemoryRouter } from 'react-router';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { orderLine } from 'fixtures';
import LinkToPoLine from './LinkToPoLine';


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
