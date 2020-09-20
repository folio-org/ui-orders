import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

function TitleView({ poLineDetails }) {
  const instanceId = poLineDetails?.instanceId;
  const title = poLineDetails?.titleOrPackage;
  const titleValue = instanceId
    ? <Link to={`/inventory/view/${instanceId}`}>{title}</Link>
    : title;

  return (
    <KeyValue
      label={<FormattedMessage id={`ui-orders.itemDetails.${poLineDetails.isPackage ? 'packageName' : 'title'}`} />}
      value={titleValue || <NoValue />}
    />
  );
}

TitleView.propTypes = {
  poLineDetails: PropTypes.object,
};

TitleView.defaultValues = {
  poLineDetails: {},
};

export default TitleView;
