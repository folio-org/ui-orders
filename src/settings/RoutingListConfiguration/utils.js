import {
  get,
  isEmpty,
} from 'lodash';
import { FormattedMessage } from 'react-intl';

export const validateRoutingListConfigurationForm = (values) => {
  const { localizedTemplates } = values;
  const body = get(localizedTemplates, 'en.body', '');
  const EMPTY_TEMPLATE_CONTENT = '<div><br></div>';

  if (isEmpty(body) || body === EMPTY_TEMPLATE_CONTENT) {
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
