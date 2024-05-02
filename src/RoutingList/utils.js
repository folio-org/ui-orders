import { FormattedMessage } from 'react-intl';

export const validateRoutingListForm = ({ name }) => {
  if (!name.trim().length) {
    return {
      name: <FormattedMessage id="ui-orders.routing.list.name.validation.required" />,
    };
  }

  return {};
};
