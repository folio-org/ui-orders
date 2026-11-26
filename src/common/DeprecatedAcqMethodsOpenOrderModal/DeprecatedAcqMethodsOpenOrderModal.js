import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { MessageBanner } from '@folio/stripes/components';
import { getAcqMethodLabel } from '@folio/stripes-acq-components';

import { OpenOrderModal } from '../OpenOrderModal';

export const DeprecatedAcqMethodsOpenOrderModal = ({
  deprecatedAcqMethods,
  ...props
}) => {
  const intl = useIntl();

  const deprecatedMethodsList = deprecatedAcqMethods
    .map((method) => {
      const label = getAcqMethodLabel(method, { intl });

      return method.poLineNumbers?.length
        ? `${label} (${method.poLineNumbers.join(', ')})`
        : label;
    })
    .join(', ');

  return (
    <OpenOrderModal {...props}>
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
    </OpenOrderModal>
  );
};

DeprecatedAcqMethodsOpenOrderModal.propTypes = {
  deprecatedAcqMethods: PropTypes.arrayOf(PropTypes.object).isRequired,
};
