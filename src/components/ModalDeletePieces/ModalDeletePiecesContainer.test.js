import React from 'react';
import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import ModalDeletePiecesContainer from './ModalDeletePiecesContainer';
import { orderLine } from '../../../test/jest/fixtures';

const defaultProps = {
  poLines: [orderLine],
  onCancel: jest.fn(),
  onSubmit: jest.fn(),
  mutator: {
    deletePiece: {
      DELETE: jest.fn().mockResolvedValue(),
    },
    reset: jest.fn(),
    items: {
      GET: jest.fn().mockResolvedValue([{
        id: 'itemId',
        barcode: 'barcode',
        itemLevelCallNumber: 'itemLevelCallNumber',
      }]),
      reset: jest.fn(),
    },
    linePieces: {
      GET: jest.fn().mockResolvedValue([{
        itemId: 'itemId',
        locationId: 'locationId',
      }]),
      reset: jest.fn(),
    },
    pieceLocations: {
      GET: jest.fn().mockResolvedValue([{
        id: 'id',
        name: 'name',
        code: 'code',
      }]),
      reset: jest.fn(),
    },
    requests: {
      GET: jest.fn().mockResolvedValue([{
        itemId: 'itemId',
      }]),
      reset: jest.fn(),
    },
  },
};

const renderModalDeletePiecesContainer = (props = {}) => render(
  <ModalDeletePiecesContainer
    {...defaultProps}
    {...props}
  />,
);

describe('ModalDeletePiecesContainer', () => {
  it('should render modal', async () => {
    renderModalDeletePiecesContainer();

    const title = await screen.findByText('ui-orders.deletePiece.title');

    expect(title).toBeInTheDocument();
  });

  it('should delete selected pieces', async () => {
    renderModalDeletePiecesContainer();

    const checkboxs = await screen.findAllByRole('checkbox');
    const deleteBtn = await screen.findByText('ui-orders.deletePiece.btn.deletePiece');

    user.dblClick(checkboxs[1]);
    user.click(checkboxs[0]);
    user.click(deleteBtn);

    expect(defaultProps.mutator.deletePiece.DELETE).toHaveBeenCalled();
  });
});
