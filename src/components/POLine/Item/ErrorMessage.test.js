import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { ErrorMessage } from './ErrorMessage';

const renderErrorMessage = (errorMessage = '') => render(
  <ErrorMessage>{errorMessage}</ErrorMessage>,
);

describe('ErrorMessage', () => {
  it('should render component', () => {
    renderErrorMessage(<div>Error Message</div>);

    expect(screen.getByText('Error Message')).toBeInTheDocument();
  });
});
