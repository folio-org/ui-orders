import React from 'react';
import { render, screen } from '@testing-library/react';

import FieldsNotes from './FieldsNotes';

jest.mock('react-final-form-arrays', () => ({
  FieldArray: jest.fn().mockReturnValue('Notes Field'),
}));

describe('FieldsNotes', () => {
  it('should render notes field', () => {
    render(<FieldsNotes />);

    expect(screen.getByText('Notes Field')).toBeInTheDocument();
  });
});
