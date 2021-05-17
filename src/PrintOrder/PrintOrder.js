import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useReactToPrint } from 'react-to-print';
import { useIntl } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import {
  Button,
  Modal,
  ModalFooter,
  Loading,
} from '@folio/stripes/components';

import { exportManifest, getExportData } from '../common/ExportSettingsModal/utils';

import PrintContent from './PrintContent';
import { hydrateOrderToPrint } from './hydrateOrderToPrint';

export const PrintOrderComponent = ({ mutator, order, onCancel }) => {
  const intl = useIntl();

  const [isLoading, setIsLoading] = useState(true);
  const [printableOrder, setPrintableOrder] = useState();

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: onCancel,
  });

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      const { compositePoLines } = order;

      setPrintableOrder(hydrateOrderToPrint({
        order: {
          ...order,
          exportData: await getExportData(mutator, compositePoLines, [order], intl),
        },
      }));

      setIsLoading(false);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const modalFooter = (
    <ModalFooter>
      <Button
        disabled={isLoading}
        buttonStyle="primary"
        onClick={handlePrint}
        marginBottom0
      >
        {intl.formatMessage({ id: 'ui-orders.button.print' })}
      </Button>
      <Button
        buttonStyle="default"
        onClick={onCancel}
        marginBottom0
      >
        {intl.formatMessage({ id: 'ui-orders.buttons.line.cancel' })}
      </Button>
    </ModalFooter>
  );

  return (
    <>
      <Modal
        label={intl.formatMessage({ id: 'ui-orders.print' })}
        aria-label={intl.formatMessage({ id: 'ui-orders.print' })}
        footer={modalFooter}
        scope="module"
        size="small"
        open
      >
        {isLoading && <Loading />}
      </Modal>
      <PrintContent
        ref={componentRef}
        dataSource={printableOrder}
      />
    </>
  );
};

PrintOrderComponent.manifest = exportManifest;

PrintOrderComponent.propTypes = {
  mutator: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  order: PropTypes.object,
};

export const PrintOrder = stripesConnect(PrintOrderComponent);
