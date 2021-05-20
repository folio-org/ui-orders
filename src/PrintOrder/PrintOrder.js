import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useReactToPrint } from 'react-to-print';
import { useIntl } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import { useShowCallout } from '@folio/stripes-acq-components';

import { exportManifest, getExportData } from '../common/ExportSettingsModal/utils';

import PrintContent from './PrintContent';
import { hydrateOrderToPrint } from './hydrateOrderToPrint';

export const PrintOrderComponent = ({ mutator, order, onCancel }) => {
  const intl = useIntl();
  const showCallout = useShowCallout();

  const [printableOrder, setPrintableOrder] = useState();

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: onCancel,
  });

  useEffect(() => {
    (async () => {
      const { compositePoLines } = order;

      showCallout({ message: intl.formatMessage({ id: 'ui-orders.print' }) });

      setPrintableOrder(hydrateOrderToPrint({
        order: {
          ...order,
          lines: await getExportData(mutator, compositePoLines, [order], intl),
        },
      }));

      handlePrint();
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
};

export const PrintOrder = stripesConnect(PrintOrderComponent);
