import { MemoryRouter } from 'react-router-dom';

import { render } from '@folio/jest-config-stripes/testing-library/react';

import DuplicateLinesList from './DuplicateLinesList';

const LINES_LIST = [{
  poLineNumber: '10000-1',
  order: { workflowStatus: 'Open' },
}];

const renderDuplicateLinesList = (lines) => (render(
  <MemoryRouter>
    <DuplicateLinesList
      lines={lines}
    />
  </MemoryRouter>,
));

describe('DuplicateLinesList component', () => {
  it('should display duplicate lines list title', () => {
    const { getByText } = renderDuplicateLinesList(LINES_LIST);

    expect(getByText('ui-orders.duplicateLines.confirmation.title')).toBeDefined();
  });

  it('should display line in the list', () => {
    const { getByText } = renderDuplicateLinesList(LINES_LIST);

    expect(getByText(LINES_LIST[0].poLineNumber)).toBeDefined();
    expect(getByText('stripes-acq-components.order.status.open')).toBeDefined();
  });
});
