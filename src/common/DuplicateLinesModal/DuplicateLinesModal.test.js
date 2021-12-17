import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import DuplicateLinesModal from './DuplicateLinesModal';

const renderDuplicateLinesModal = ({
  duplicateLines = [],
  onSubmit = jest.fn(),
  onCancel = jest.fn(),
}) => (render(
  <MemoryRouter>
    <DuplicateLinesModal
      duplicateLines={duplicateLines}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  </MemoryRouter>,
));

describe('DuplicateLinesModal component', () => {
  it('should display duplicate lines modal', () => {
    const { getByText } = renderDuplicateLinesModal({});

    expect(getByText('ui-orders.buttons.line.submit')).toBeDefined();
    expect(getByText('ui-orders.buttons.line.cancel')).toBeDefined();
  });
});
