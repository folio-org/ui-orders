import get from 'lodash/get';
import PropTypes from 'prop-types';

import {
  Button,
  Icon,
} from '@folio/stripes/components';
import { getFullName } from '@folio/stripes/util';

export const RoutingListUserItem = ({ canRemove, user, onRemove }) => {
  const { id, personal } = user;
  const address = get(personal, 'addresses[0].addressLine1', '');

  return (
    <li key={id}>
      {getFullName(user) + (address ? ` - ${address}` : '')}
      {
        canRemove && (
          <Button
            buttonStyle="fieldControl"
            align="end"
            type="button"
            id={`clickable-remove-user-${id}`}
            onClick={() => onRemove(id)}
          >
            <Icon icon="times-circle" />
          </Button>
        )
      }
    </li>
  );
};

RoutingListUserItem.propTypes = {
  canRemove: PropTypes.bool,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    personal: PropTypes.shape({
      addresses: PropTypes.arrayOf(PropTypes.shape({
        addressLine1: PropTypes.string,
      })),
    }),
  }).isRequired,
  onRemove: PropTypes.func,
};
