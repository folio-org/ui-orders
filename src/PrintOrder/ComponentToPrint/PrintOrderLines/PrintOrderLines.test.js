import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { PrintOrderLines } from './PrintOrderLines';

const fundCode = 'FUAS';
const line = {
  poLineNumber: '1000',
  titleOrPackage: 'ABA Jorney',
  rush: true,
  instructions: 'Payment will be later',
  productIdentifier: '12343212 ISBN',
  currency: 'USD',
  poLineEstimatedPrice: '500.54',
  sourceRecord: {
    publicationDate: '2024',
    publisher: 'Nelson',
    fundDistribution: [{ code: fundCode }],
  },
};

const renderPrintOrderLines = ({ lines = [] }) => (render(
  <PrintOrderLines lines={lines} />,
));

describe('PrintOrderLines', () => {
  it('should display POL # column', () => {
    renderPrintOrderLines({ lines: [line] });

    expect(screen.getByText(line.poLineNumber)).toBeDefined();
  });

  it('should display Title column', () => {
    renderPrintOrderLines({ lines: [line] });

    expect(screen.getByText(line.titleOrPackage)).toBeDefined();
  });

  it('should display Vendor instructions column', () => {
    renderPrintOrderLines({ lines: [line] });

    expect(screen.getByText(line.instructions)).toBeDefined();
  });

  it('should display Estimated price column', () => {
    renderPrintOrderLines({ lines: [line] });

    expect(screen.getByText(`$${line.poLineEstimatedPrice}`)).toBeDefined();
  });

  describe('Quantity electronic column', () => {
    it('should be hidden when quantity is 0', () => {
      renderPrintOrderLines({ lines: [line] });

      expect(screen.queryByText('ui-orders.cost.quantityElectronic')).toBeNull();
    });

    it('should be visible when quantity is not 0', () => {
      const lineWithElectronicQuantity = {
        ...line,
        quantityElectronic: 5,
      };

      renderPrintOrderLines({ lines: [lineWithElectronicQuantity] });

      expect(screen.getByText('ui-orders.cost.quantityElectronic')).toBeDefined();
    });
  });

  describe('Quantity physical column', () => {
    it('should be hidden when quantity is 0', () => {
      renderPrintOrderLines({ lines: [line] });

      expect(screen.queryByText('ui-orders.cost.quantityPhysical')).toBeNull();
    });

    it('should be visible when quantity is not 0', () => {
      const lineWithPhysicalQuantity = {
        ...line,
        quantityPhysical: 5,
      };

      renderPrintOrderLines({ lines: [lineWithPhysicalQuantity] });

      expect(screen.getByText('ui-orders.cost.quantityPhysical')).toBeDefined();
    });
  });

  describe('Details column', () => {
    it('should display publication date', () => {
      renderPrintOrderLines({ lines: [line] });

      expect(screen.getByText(line.sourceRecord.publicationDate, { exact: false })).toBeDefined();
    });

    it('should display publisher', () => {
      renderPrintOrderLines({ lines: [line] });

      expect(screen.getByText(line.sourceRecord.publisher, { exact: false })).toBeDefined();
    });

    it('should display product ids', () => {
      renderPrintOrderLines({ lines: [line] });

      expect(screen.getByText(line.productIdentifier, { exact: false })).toBeDefined();
    });

    it('should display fund codes ids', () => {
      renderPrintOrderLines({ lines: [line] });

      expect(screen.getByText(fundCode, { exact: false })).toBeDefined();
    });

    it('should display Rush value', () => {
      renderPrintOrderLines({ lines: [line] });

      expect(screen.getByText('ui-orders.filter.true', { exact: false })).toBeDefined();
    });
  });
});
