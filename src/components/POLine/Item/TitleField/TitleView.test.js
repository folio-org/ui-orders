import React from 'react';
import { render, screen } from '@testing-library/react';

import TitleView from './TitleView';
import { orderLine } from '../../../../../test/jest/fixtures';

const defaultProps = {
  poLineDetails: orderLine,
};

const renderTitleView = (props = {}) => render(
  <TitleView
    {...defaultProps}
    {...props}
  />,
);

describe('TitleView', () => {
  it('should render \'title\' view', () => {
    renderTitleView();

    expect(screen.getByText(orderLine.titleOrPackage)).toBeInTheDocument();
  });
});
