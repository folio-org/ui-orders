import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { orderLine } from 'fixtures';
import TitleView from './TitleView';

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
