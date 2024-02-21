import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useReactToPrint } from 'react-to-print';
import { useIntl } from 'react-intl';

import {
  stripesConnect,
  useOkapiKy,
} from '@folio/stripes/core';

import { exportManifest, getExportData } from '../common/ExportSettingsModal/utils';

import { usePOLineTotalEstimatedPrice } from './hooks';
import { hydrateOrderToPrint } from './hydrateOrderToPrint';
import PrintContent from './PrintContent';
import {
  getOrderPrintData,
  getPrintPageStyles,
} from './utils';

export const PrintOrderComponent = ({ mutator, order, orderLine, onCancel }) => {
  const intl = useIntl();
  const { getPOLineTotalEstimatedPrice } = usePOLineTotalEstimatedPrice();
  const ky = useOkapiKy();

  const [printableOrder, setPrintableOrder] = useState();

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    pageStyle: getPrintPageStyles(),
    content: () => componentRef.current,
    onAfterPrint: onCancel,
  });

  useEffect(() => {
    (async () => {
      const { compositePoLines } = order;
      const linesToPrint = orderLine ? [orderLine] : compositePoLines;
      const printData = compositePoLines?.length
        ? { lines: await getExportData(mutator, linesToPrint, [order], intl) }
        : await getOrderPrintData(ky, order);

      setPrintableOrder(await hydrateOrderToPrint({
        getPOLineTotalEstimatedPrice,
        order: {
          ...order,
          ...printData,
        },
      }));
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (printableOrder) {
      handlePrint();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [printableOrder]);

  return (
    <PrintContent
      ref={componentRef}
      dataSource={printableOrder}
    />
  );
};

PrintOrderComponent.manifest = exportManifest;

PrintOrderComponent.propTypes = {
  mutator: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  order: PropTypes.object,
  orderLine: PropTypes.object,
};

export const PrintOrder = stripesConnect(PrintOrderComponent);
