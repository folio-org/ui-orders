import { pick } from 'lodash';

export const getPrintPageStyles = () => `
  @page {
    size: A4 landscape;
    margin: 30px;
  }

  @media print {
    html, body {
      height: auto !important;
      overflow: initial !important;
      color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
  }
`;

export const buildAddressString = (address = {}) => (
  Object.values(
    pick(address, [
      'addressLine1',
      'addressLine2',
      'city',
      'stateRegion',
      'zipCode',
      'country',
    ]),
  )
    .filter(Boolean)
    .join(', ')
);
