import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import ErrorMessage from './ErrorMessage';

const renderErrorMessage = (props = {}) => render(
  <ErrorMessage>{props}</ErrorMessage>,
);

describe('ErrorMessage', () => {
  it('should render component', () => {
    renderErrorMessage(<div>Error Message</div>);

    expect(screen.getByText('Error Message')).toBeInTheDocument();
  });
});
