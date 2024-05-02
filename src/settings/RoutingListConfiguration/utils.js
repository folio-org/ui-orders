import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

export const validateRoutingListConfigurationForm = (values) => {
  const { localizedTemplates } = values;
  const body = get(localizedTemplates, 'en.body', '');

  if (body.trim().length) {
    return {
      localizedTemplates: {
        en: {
          body: <FormattedMessage id="ui-orders.settings.routing.listConfiguration.body.required" />,
        },
      },
    };
  }

  return {};
};
