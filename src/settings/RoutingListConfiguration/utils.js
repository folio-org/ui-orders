import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

const ESCAPE_HTML_TAGS_REGEX = /<(.|\n)*?>/g;

export const validateRoutingListConfigurationForm = (values) => {
  const { localizedTemplates } = values;
  const body = get(localizedTemplates, 'en.body', '');

  if (!body.replace(ESCAPE_HTML_TAGS_REGEX, '').trim().length) {
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
