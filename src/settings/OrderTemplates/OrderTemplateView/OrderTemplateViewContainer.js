import get from 'lodash/get';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  stripesConnect,
  TitleManager,
} from '@folio/stripes/core';
import {
  getErrorCodeFromResponse,
  useCentralOrderingContext,
  useLocationsQuery,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { useOrderTemplate } from '../../../common/hooks';
import {
  getAddresses,
  getCommonErrorMessage,
} from '../../../common/utils';
import {
  ADDRESSES,
  MATERIAL_TYPES,
  ORDER_TEMPLATE,
} from '../../../components/Utils/resources';
import { useOrderTemplateCategories } from '../../hooks';
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
  const { isCentralOrderingEnabled } = useCentralOrderingContext();

  const {
    isLoading: isLocationsLoading,
    locations,
  } = useLocationsQuery({ consortium: isCentralOrderingEnabled });

  const {
    isFetching: isOrderTemplateCategoriesFetching,
    orderTemplateCategories,
  } = useOrderTemplateCategories();

  const {
    isFetching: isOrderTemplateFetching,
    orderTemplate,
  } = useOrderTemplate(id);

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

  const addresses = getAddresses(get(resources, 'addresses.records', []));
  const funds = get(resources, 'funds.records', []);
  const materialTypes = get(resources, 'materialTypes.records', []);

  const isLoading = (
    isLocationsLoading
    || isOrderTemplateCategoriesFetching
    || isOrderTemplateFetching
  );

  return (
    <TitleManager
      page={intl.formatMessage({ id: 'ui-orders.settings.orderTemplates' })}
      record={orderTemplate?.templateName}
    >
      <OrderTemplateView
        addresses={addresses}
        close={close}
        funds={funds}
        isLoading={isLoading}
        locations={locations}
        materialTypes={materialTypes}
        onDuplicate={onDuplicateOrderTemplate}
        onDelete={onDeleteOrderTemplate}
        rootPath={rootPath}
        orderTemplate={orderTemplate}
        orderTemplateCategories={orderTemplateCategories}
        stripes={stripes}
        history={history}
      />
    </TitleManager>
  );
}

OrderTemplateViewContainer.manifest = Object.freeze({
  addresses: ADDRESSES,
  materialTypes: MATERIAL_TYPES,
  orderTemplate: {
    ...ORDER_TEMPLATE,
    fetch: false,
  },
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
