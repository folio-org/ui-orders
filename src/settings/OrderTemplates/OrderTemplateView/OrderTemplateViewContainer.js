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
import { TEMPLATES_RETURN_LINK } from '../constants';
import OrderTemplateView from './OrderTemplateView';

const getNewTemplateName = ({ intl, templateName }) => {
  const nameSuffix = intl.formatMessage({ id: 'ui-orders.settings.orderTemplates.duplicate.suffix' });
  const timestamp = intl.formatDate(Date.now(), {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  return `${templateName} ${nameSuffix} - ${timestamp}`;
};

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

  const onDuplicateOrderTemplate = useCallback(async ({ id: _, templateName, ...template }) => {
    try {
      const newTemplate = {
        templateName: getNewTemplateName({ intl, templateName }),
        ...template,
      };

      const { id: newTemplateId } = await mutator.orderTemplate.POST(newTemplate);

      sendCallout({ messageId: 'ui-orders.settings.orderTemplates.duplicate.success' });
      history.push(`${TEMPLATES_RETURN_LINK}/order-templates/${newTemplateId}/edit`);
    } catch (errorResponse) {
      const errorCode = await getErrorCodeFromResponse(errorResponse);
      const defaultMessage = intl.formatMessage({ id: 'ui-orders.settings.orderTemplates.duplicate.error' });
      const message = getCommonErrorMessage(errorCode, defaultMessage);

      sendCallout({
        message,
        type: 'error',
      });
    }
  }, [history, intl, mutator.orderTemplate, sendCallout]);

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
      onDuplicate={onDuplicateOrderTemplate}
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
