import { useCallback } from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  TitleManager,
  stripesConnect,
  useStripes,
} from '@folio/stripes/core';
import { ControlledVocab } from '@folio/stripes/smart-components';
import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { ORDER_TEMPLATE_CATEGORIES_API } from '../../components/Utils/api';
import { validateDuplicates } from '../utils';

const FIELD_NAMES = {
  name: 'name',
  numberOfObjects: 'numberOfObjects',
  lastUpdated: 'lastUpdated',
};

const ConnectedControlledVocab = stripesConnect(ControlledVocab);

const columnMapping = {
  [FIELD_NAMES.name]: <FormattedMessage id="ui-orders.settings.orderTemplateCategories.field.name" />,
};
const hiddenFields = [FIELD_NAMES.numberOfObjects, FIELD_NAMES.lastUpdated];
const translations = {
  ...getControlledVocabTranslations('ui-orders.settings.orderTemplateCategories'),
  termCreated: 'ui-orders.settings.orderTemplateCategories.termCreated',
  termUpdated: 'ui-orders.settings.orderTemplateCategories.termUpdated',
};
const visibleFields = [FIELD_NAMES.name];

export const OrderTemplateCategories = () => {
  const intl = useIntl();
  const stripes = useStripes();

  const hasCreatePerms = stripes.hasPerm('orders-storage.order-template-categories.item.post');
  const hasEditPerms = stripes.hasPerm('orders-storage.order-template-categories.item.put');
  const hasDeletePerms = stripes.hasPerm('orders-storage.order-template-categories.item.delete');

  const validate = useCallback((...params) => validateDuplicates(intl, [FIELD_NAMES.name])(...params), [intl]);

  return (
    <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.orderTemplateCategories' })}>
      <ConnectedControlledVocab
        actionSuppressor={{
          edit: () => !hasEditPerms,
          delete: () => !hasDeletePerms,
        }}
        baseUrl={ORDER_TEMPLATE_CATEGORIES_API}
        canCreate={hasCreatePerms}
        columnMapping={columnMapping}
        hiddenFields={hiddenFields}
        id="orderTemplateCategories"
        label={intl.formatMessage({ id: 'ui-orders.settings.orderTemplateCategories' })}
        listFormLabel={intl.formatMessage({ id: 'ui-orders.settings.orderTemplateCategories.sub' })}
        nameKey={FIELD_NAMES.name}
        records="orderTemplateCategories"
        translations={translations}
        validate={validate}
        visibleFields={visibleFields}
      />
    </TitleManager>
  );
};
