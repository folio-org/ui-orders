import { useIntl } from 'react-intl';
import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { TEMPLATES_API } from '../../../../common/constants/api';
import {
  LIST_CONFIGURATION_TEMPLATE_ID,
  LIST_CONFIGURATION_TEMPLATE_NAME,
} from '../../constants';

export const useListConfigurationMutation = () => {
  const { formatMessage } = useIntl();
  const ky = useOkapiKy();

  const createMutationFn = (templateData = {}) => {
    const { localizedTemplates, ...restValues } = templateData;

    return ky.post(TEMPLATES_API, {
      json: {
        id: LIST_CONFIGURATION_TEMPLATE_ID,
        name: LIST_CONFIGURATION_TEMPLATE_NAME,
        active: true,
        outputFormats: ['text/html'],
        templateResolver: 'mustache',
        ...restValues,
        localizedTemplates: {
          en: {
            body: localizedTemplates.en.body,
            header: formatMessage({ id: 'ui-orders.settings.routing.listConfiguration' }),
          },
        },
      },
    });
  };

  const updateMutationFn = (templateData = {}) => {
    return ky.put(`${TEMPLATES_API}/${LIST_CONFIGURATION_TEMPLATE_ID}`, {
      json: templateData,
    });
  };

  const { mutateAsync: createListConfig, isCreating } = useMutation({ mutationFn: createMutationFn });
  const { mutateAsync: updateListConfig, isLoading: isUpdating } = useMutation({ mutationFn: updateMutationFn });

  return {
    createListConfig,
    isCreating,
    isUpdating,
    updateListConfig,
  };
};
