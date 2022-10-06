import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Button,
  Loading,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';
import {
  useOrganization,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { REEXPORT_SOURCES } from '../constants';
import { useReexport } from '../hooks';
import { ExportDetailsList } from '../ExportDetailsList';

export const ReexportModal = ({
  exportHistory,
  id,
  isLoading: isLoadingProp,
  onCancel,
  onConfirm,
  order,
  poLines,
  source,
}) => {
  const intl = useIntl();
  const showCallout = useShowCallout();

  const {
    organization,
    isLoading: isOrderVendorLoading,
  } = useOrganization(order.vendor);

  const {
    reExport,
    isLoading: isReexporting,
  } = useReexport();

  const isLoading = isLoadingProp || isOrderVendorLoading;
  const modalLabel = intl.formatMessage({ id: `ui-orders.reexport.${source}.confirmModal.heading` });

  const onReexport = useCallback(() => {
    reExport(poLines)
      .then(() => {
        showCallout({
          messageId: `ui-orders.reexport.${source}.success`,
        });
      })
      .catch(() => {
        showCallout({
          messageId: `ui-orders.reexport.${source}.fail`,
          type: 'error',
        });
      })
      .finally(onConfirm);
  }, [
    onConfirm,
    poLines,
    reExport,
    showCallout,
    source,
  ]);

  const footer = (
    <ModalFooter>
      <Button
        data-testid="confirm-reexport-button"
        buttonStyle="primary"
        marginBottom0
        onClick={onReexport}
        disabled={isLoading || isReexporting}
      >
        {isReexporting && <Loading />}
        <FormattedMessage id="ui-orders.button.confirm" />
      </Button>

      <Button
        marginBottom0
        onClick={onCancel}
      >
        <FormattedMessage id="ui-orders.buttons.line.cancel" />
      </Button>
    </ModalFooter>
  );

  const message = (
    <>
      <FormattedMessage
        id={`ui-orders.reexport.${source}.confirmModal.message`}
        values={{
          exportMethod: exportHistory[0]?.exportMethod,
          vendorFromExport: exportHistory[0]?.vendorName,
          vendorFromOrder: `${organization?.name} (${organization?.code})`,
        }}
      />

      {source === REEXPORT_SOURCES.order && (
        <ExportDetailsList
          data={exportHistory}
          isLoading={isLoading}
        />
      )}
    </>
  );

  return (
    <Modal
      aria-label={modalLabel}
      open
      id={id}
      label={modalLabel}
      footer={footer}
    >
      {isLoading ? <Loading /> : message}
    </Modal>
  );
};

ReexportModal.propTypes = {
  exportHistory: PropTypes.arrayOf(PropTypes.object).isRequired,
  id: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  order: PropTypes.object.isRequired,
  poLines: PropTypes.arrayOf(PropTypes.object).isRequired,
  source: PropTypes.oneOf(Object.values(REEXPORT_SOURCES)),
};
