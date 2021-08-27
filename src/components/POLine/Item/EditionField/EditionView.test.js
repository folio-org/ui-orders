import React from 'react';
import { render, screen } from '@testing-library/react';

import EditionView from './EditionView';

const defaultProps = {
  value: 'value',
};

const renderEditionView = (props = {}) => render(
  <EditionView
    {...defaultProps}
    {...props}
  />,
);

describe('EditionView', () => {
  it('should render \'edition\' field', () => {
    renderEditionView();

    expect(screen.getByText(defaultProps.value)).toBeInTheDocument();
  });
});
