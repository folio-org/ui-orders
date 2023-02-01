import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import {
  getErrorCodeFromResponse,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  getAddresses,
  getCommonErrorMessage,
} from '../../../common/utils';
import {
  ADDRESSES,
  LOCATIONS,
  MATERIAL_TYPES,
  ORDER_TEMPLATE,
} from '../../../components/Utils/resources';
import OrderTemplateView from './OrderTemplateView';

function OrderTemplateViewContainer({
  close,
  match: { params: { id } },
  mutator,
  resources,
  rootPath,
  showSuccessDeleteMessage,
  stripes,
  history,
}) {
  const intl = useIntl();
  const sendCallout = useShowCallout();
  const onDeleteOrderTemplate = useCallback(
    async () => {
      try {
        await mutator.orderTemplate.DELETE({ id });
        close();
        showSuccessDeleteMessage();
      } catch (errorResponse) {
        const errorCode = await getErrorCodeFromResponse(errorResponse);
        const defaultMessage = intl.formatMessage({ id: 'ui-orders.settings.orderTemplates.remove.error' });
        const message = getCommonErrorMessage(errorCode, defaultMessage);

        sendCallout({
          message,
          type: 'error',
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [close, id, sendCallout, showSuccessDeleteMessage],
  );

  const orderTemplate = get(resources, ['orderTemplate', 'records', 0], {});
  const addresses = getAddresses(get(resources, 'addresses.records', []));
  const funds = get(resources, 'funds.records', []);
  const locations = get(resources, 'locations.records', []);
  const materialTypes = get(resources, 'materialTypes.records', []);

  return (
    <OrderTemplateView
      addresses={addresses}
      close={close}
      funds={funds}
      locations={locations}
      materialTypes={materialTypes}
      onDelete={onDeleteOrderTemplate}
      rootPath={rootPath}
      orderTemplate={orderTemplate}
      stripes={stripes}
      history={history}
    />
  );
}

OrderTemplateViewContainer.manifest = Object.freeze({
  addresses: ADDRESSES,
  locations: LOCATIONS,
  materialTypes: MATERIAL_TYPES,
  orderTemplate: ORDER_TEMPLATE,
});

OrderTemplateViewContainer.propTypes = {
  close: PropTypes.func.isRequired,
  mutator: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  rootPath: PropTypes.string.isRequired,
  showSuccessDeleteMessage: PropTypes.func.isRequired,
  resources: PropTypes.object,
  stripes: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(OrderTemplateViewContainer));
