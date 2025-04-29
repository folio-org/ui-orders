import get from 'lodash/get';
import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
} from 'react';
import { useIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesConnect, TitleManager } from '@folio/stripes/core';
import {
  DICT_CONTRIBUTOR_NAME_TYPES,
  DICT_IDENTIFIER_TYPES,
  getErrorCodeFromResponse,
  prefixesResource,
  suffixesResource,
  useCentralOrderingContext,
  useLocationsQuery,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  IDENTIFIER_TYPES,
  ADDRESSES,
  FUND,
  CREATE_INVENTORY,
  VENDORS,
  MATERIAL_TYPES,
  ORDER_TEMPLATE,
  CONTRIBUTOR_NAME_TYPES,
} from '../../../components/Utils/resources';
import getIdentifierTypesForSelect from '../../../components/Utils/getIdentifierTypesForSelect';
import getFundsForSelect from '../../../components/Utils/getFundsForSelect';
import getMaterialTypesForSelect from '../../../components/Utils/getMaterialTypesForSelect';
import getContributorNameTypesForSelect from '../../../components/Utils/getContributorNameTypesForSelect';
import {
  getCreateInventorySetting,
  getAddresses,
  getAddressOptions,
  getCommonErrorMessage,
} from '../../../common/utils';
import { ORGANIZATION_STATUS_ACTIVE } from '../../../common/constants';
import { useOrderTemplate } from '../../../common/hooks';

import OrderTemplatesEditor from './OrderTemplatesEditor';

const INITIAL_VALUES = { isPackage: false, hideAll: false };

function OrderTemplatesEditorContainer({
  match: { params: { id } },
  close,
  resources,
  stripes,
  mutator,
}) {
  const intl = useIntl();
  const showToast = useShowCallout();
  const { isCentralOrderingEnabled } = useCentralOrderingContext();

  const saveOrderTemplate = useCallback((values) => {
    const mutatorMethod = id ? mutator.orderTemplate.PUT : mutator.orderTemplate.POST;
    const templateName = values.templateName?.trim();

    mutatorMethod({ ...values, templateName, hideAll: undefined })
      .then(() => {
        showToast({ messageId: 'ui-orders.settings.orderTemplates.save.success' });
        close();
      })
      .catch(async (errorResponse) => {
        const errorCode = await getErrorCodeFromResponse(errorResponse);
        const defaultMessage = intl.formatMessage({ id: 'ui-orders.settings.orderTemplates.save.error' });
        const message = getCommonErrorMessage(errorCode, defaultMessage);

        showToast({
          message,
          type: 'error',
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [close, id, intl, showToast]);

  const {
    isFetching: isOrderTemplateFetching,
    orderTemplate,
  } = useOrderTemplate(id);

  const {
    isLoading: isLocationsLoading,
    locations,
  } = useLocationsQuery({ consortium: isCentralOrderingEnabled });

  const locationIds = useMemo(() => locations?.map(location => location.id), [locations]);
  const funds = getFundsForSelect(resources);
  const identifierTypes = getIdentifierTypesForSelect(resources);
  const contributorNameTypes = getContributorNameTypesForSelect(resources);
  const createInventorySetting = getCreateInventorySetting(get(resources, ['createInventory', 'records'], []));
  const vendors = get(resources, 'vendors.records', [])
    .filter(({ isVendor, status }) => isVendor && status === ORGANIZATION_STATUS_ACTIVE);
  const prefixesSetting = get(resources, 'prefixesSetting.records', [])
    .map(({ name }) => ({ label: name, value: name }));
  const suffixesSetting = get(resources, 'suffixesSetting.records', [])
    .map(({ name }) => ({ label: name, value: name }));
  const addresses = getAddressOptions(getAddresses(get(resources, 'addresses.records', [])));
  const materialTypes = getMaterialTypesForSelect(resources);
  const initialValues = orderTemplate.id
    ? {
      ...orderTemplate,
      hideAll: false,
    }
    : INITIAL_VALUES;
  const title = get(initialValues, ['templateName']) || intl.formatMessage({ id: 'ui-orders.settings.orderTemplates.editor.titleCreate' });

  const isLoading = isOrderTemplateFetching || isLocationsLoading;

  return (
    <TitleManager
      page={intl.formatMessage({ id: 'ui-orders.settings.orderTemplates' })}
      record={title}
    >
      <OrderTemplatesEditor
        isLoading={isLoading}
        title={title}
        onSubmit={saveOrderTemplate}
        close={close}
        funds={funds}
        initialValues={initialValues}
        identifierTypes={identifierTypes}
        locationIds={locationIds}
        locations={locations}
        createInventorySetting={createInventorySetting}
        prefixesSetting={prefixesSetting}
        suffixesSetting={suffixesSetting}
        addresses={addresses}
        materialTypes={materialTypes}
        vendors={vendors}
        contributorNameTypes={contributorNameTypes}
        stripes={stripes}
        centralOrdering={isCentralOrderingEnabled}
      />
    </TitleManager>
  );
}

OrderTemplatesEditorContainer.manifest = Object.freeze({
  [DICT_IDENTIFIER_TYPES]: IDENTIFIER_TYPES,
  fund: FUND,
  createInventory: CREATE_INVENTORY,
  prefixesSetting: prefixesResource,
  suffixesSetting: suffixesResource,
  addresses: ADDRESSES,
  vendors: VENDORS,
  materialTypes: MATERIAL_TYPES,
  orderTemplate: {
    ...ORDER_TEMPLATE,
    fetch: false,
  },
  [DICT_CONTRIBUTOR_NAME_TYPES]: CONTRIBUTOR_NAME_TYPES,
});

OrderTemplatesEditorContainer.propTypes = {
  close: PropTypes.func.isRequired,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(OrderTemplatesEditorContainer));
