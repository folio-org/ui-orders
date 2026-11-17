import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Button, MessageBanner, Modal } from '@folio/stripes/components';
import { getAcqMethodLabel } from '@folio/stripes-acq-components';

export const BaseOpenOrderModal = ({
  deprecatedAcqMethods,
  isLoading = false,
  onCancel,
  onSubmit,
  orderNumber,
}) => {
  const intl = useIntl();

  const modalLabel = intl.formatMessage(
    { id: 'ui-orders.openOrderModal.title' },
    { orderNumber },
  );

  const deprecatedMethodsList = deprecatedAcqMethods
    .map((method) => {
      const label = getAcqMethodLabel(method, { intl });

      return method.poLineNumbers?.length
        ? `${label} (${method.poLineNumbers.join(', ')})`
        : label;
    })
    .join(', ');

  const footer = (
    <div>
      <Button
        onClick={onCancel}
        data-test-open-order-confirmation-modal-cancel
        marginBottom0
      >
        <FormattedMessage id="ui-orders.openOrderModal.cancel" />
      </Button>

      <Button
        buttonStyle="primary"
        data-test-open-order-confirmation-modal-submit
        disabled={isLoading}
        marginBottom0
        onClick={onSubmit}
      >
        <FormattedMessage id="ui-orders.openOrderModal.submit" />
      </Button>
    </div>
  );

  return (
    <Modal
      aria-label={modalLabel}
      label={modalLabel}
      open
      data-test-open-order-confirmation-modal
      footer={footer}
    >
      <div data-test-open-order-confirmation-modal-content>
        {deprecatedAcqMethods.length > 0 && (
          <MessageBanner
            type="warning"
            data-test-open-order-deprecated-acq-method-warning
          >
            <FormattedMessage
              id="ui-orders.openOrderModal.deprecatedAcquisitionMethods"
              values={{
                count: deprecatedAcqMethods.length,
                methods: deprecatedMethodsList,
              }}
            />
          </MessageBanner>
        )}

        <div>
          <FormattedMessage id="ui-orders.openOrderModal.message" />
        </div>
      </div>
    </Modal>
  );
};

BaseOpenOrderModal.propTypes = {
  deprecatedAcqMethods: PropTypes.arrayOf(PropTypes.object).isRequired,
  isLoading: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  orderNumber: PropTypes.string.isRequired,
};
