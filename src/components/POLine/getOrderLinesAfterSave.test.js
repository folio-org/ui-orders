import { getOrderLinesAfterSave } from './getOrderLinesAfterSave';

describe('getOrderLinesAfterSave', () => {
  const firstLine = { id: 'first', acquisitionMethod: 'purchase', poLineNumber: '1-1' };
  const secondLine = { id: 'second', acquisitionMethod: 'gift', poLineNumber: '1-2' };

  it('should replace the saved line in place with its edited values', () => {
    const editedLine = { id: 'first', acquisitionMethod: 'gift' };

    expect(getOrderLinesAfterSave(editedLine, [firstLine, secondLine])).toEqual([
      { ...firstLine, acquisitionMethod: 'gift' },
      secondLine,
    ]);
  });

  it('should add a line that is not in the order yet', () => {
    const newLine = { id: 'new', acquisitionMethod: 'purchase' };

    expect(getOrderLinesAfterSave(newLine, [firstLine])).toEqual([firstLine, newLine]);
  });

  it('should return only the line when the order has no lines', () => {
    expect(getOrderLinesAfterSave(firstLine)).toEqual([firstLine]);
  });
});
