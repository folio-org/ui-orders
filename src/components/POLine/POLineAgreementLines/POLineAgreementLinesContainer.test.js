import { render, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';

import POLineAgreementLinesContainer from './POLineAgreementLinesContainer';
import POLineAgreementLines from './POLineAgreementLines';

jest.mock('./POLineAgreementLines', () => jest.fn().mockReturnValue('POLineAgreementLines'));

const defaultProps = {
  label: '',
  lineId: 'lineId',
  mutator: {
    agreements: {
      GET: jest.fn().mockResolvedValue([{
        id: 'ownerId',
      }]),
    },
    agreementLines: {
      GET: jest.fn().mockResolvedValue({
        results: [{
          owner: {
            id: 'ownerId',
          },
        }],
      }),
    },
  },
};

const renderPOLineAgreementLinesContainer = (props = {}) => render(
  <POLineAgreementLinesContainer
    {...defaultProps}
    {...props}
  />,
);

describe('POLineAgreementLinesContainer', () => {
  it('should load and display POLine agreemnent lines', async () => {
    renderPOLineAgreementLinesContainer();

    await waitFor(() => POLineAgreementLines.mock.calls[0][0].onNeedMoreData());
    await waitFor(() => expect(screen.getByText(/POLineAgreementLines/i)).toBeInTheDocument());
  });
});
