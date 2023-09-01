import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import PrintContent from './PrintContent';

jest.mock('../ComponentToPrint', () => jest.fn().mockReturnValue('ComponentToPrint'));

const renderPrintContent = (props = {}) => render(
  <PrintContent
    {...props}
  />,
);

describe('PrintContent', () => {
  it('should render component to print', () => {
    renderPrintContent({ dataSource: {} });

    expect(screen.getByText('ComponentToPrint')).toBeInTheDocument();
  });
});
