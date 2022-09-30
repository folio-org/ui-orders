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

export const ReexportModal = ({
  id,
  onCancel,
  onConfirm,
  order,
  poLines,
  source,
}) => {
  const intl = useIntl();
  const showCallout = useShowCallout();
  const { organization, isLoading } = useOrganization(order.vendor);
  const { reExport, isLoading: isReexporting } = useReexport();

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
    <FormattedMessage
      id={`ui-orders.reexport.${source}.confirmModal.message`}
      values={{
        vendorFromOrder: organization?.name,
      }}
    />
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
  id: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  order: PropTypes.object.isRequired,
  poLines: PropTypes.arrayOf(PropTypes.object).isRequired,
  source: PropTypes.oneOf(Object.values(REEXPORT_SOURCES)),
};
