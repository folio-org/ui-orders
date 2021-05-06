import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ACCORDION_ID } from '../const';
import { LineLinkedInstances } from './LineLinkedInstances';
import { useLinkedInstances } from './useLinkedInstances';

jest.mock('./useLinkedInstances', () => ({
  useLinkedInstances: jest.fn(),
}));
jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: () => <div>Loading</div>,
}), { virtual: true });

const renderLineLinkedInstances = ({ line = {}, toggleSection = jest.fn() }) => (render(
  <LineLinkedInstances
    line={line}
    toggleSection={toggleSection}
  />,
  { wrapper: MemoryRouter },
));

describe('LineLinkedInstances', () => {
  beforeEach(() => {
    useLinkedInstances.mockClear();
  });

  it('displays spinner when loading data', () => {
    useLinkedInstances.mockReturnValue({ isLoading: true });

    renderLineLinkedInstances({});

    expect(screen.getByText('Loading')).toBeDefined();
  });

  it('displays table with records with fetched instances', () => {
    const linkedInstance = { title: 'ABA', id: 'instanceUid', contributors: 'Mark' };

    useLinkedInstances.mockReturnValue({ isLoading: false, linkedInstances: [linkedInstance] });

    renderLineLinkedInstances({ line: { instanceId: 'instanceUid' } });

    expect(screen.getByText(linkedInstance.title)).toBeInTheDocument();
  });

  it('opens section when loading', () => {
    const toggleSection = jest.fn();

    useLinkedInstances.mockReturnValue({ isLoading: true });

    renderLineLinkedInstances({ toggleSection });

    expect(toggleSection).toHaveBeenCalledWith({ id: ACCORDION_ID.linkedInstances, isOpened: true });
  });

  it('opens section when instances are fetched', () => {
    const toggleSection = jest.fn();

    useLinkedInstances.mockReturnValue({ linkedInstances: [{ id: 'instanceUid' }] });

    renderLineLinkedInstances({ toggleSection });

    expect(toggleSection).toHaveBeenCalledWith({ id: ACCORDION_ID.linkedInstances, isOpened: true });
  });

  it('closes section when no instances are fetched', () => {
    const toggleSection = jest.fn();

    useLinkedInstances.mockReturnValue({ linkedInstances: [] });

    renderLineLinkedInstances({ toggleSection });

    expect(toggleSection).toHaveBeenCalledWith({ id: ACCORDION_ID.linkedInstances, isOpened: false });
  });
});
