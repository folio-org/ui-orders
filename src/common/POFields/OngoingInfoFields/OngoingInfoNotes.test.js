import React from 'react';
import { render, screen } from '@testing-library/react';

import OngoingInfoNotes from './OngoingInfoNotes';

const renderOngoingInfoNotes = (props = {}) => render(
  <OngoingInfoNotes
    {...props}
  />,
);

describe('OngoingInfoNotes', () => {
  it('should render notes value', () => {
    const props = { value: 'test note' };

    renderOngoingInfoNotes(props);

    expect(screen.getByText(props.value)).toBeInTheDocument();
  });

  it('should render a hyphen if a value is missing', () => {
    renderOngoingInfoNotes();

    expect(screen.getByText('-')).toBeInTheDocument();
  });
});
