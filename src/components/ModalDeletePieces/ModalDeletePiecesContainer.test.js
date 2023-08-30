import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { orderLine } from 'fixtures';
import ModalDeletePiecesContainer from './ModalDeletePiecesContainer';

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

    await user.dblClick(checkboxs[1]);
    await user.click(checkboxs[0]);
    await user.click(deleteBtn);

    expect(defaultProps.mutator.deletePiece.DELETE).toHaveBeenCalled();
  });
});
