import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { find, get } from 'lodash';

import {
  MultiColumnList,
} from '@folio/stripes/components';

const columnMapping = {
  contributor: <FormattedMessage id="ui-orders.itemDetails.contributor" />,
  contributorType: <FormattedMessage id="ui-orders.itemDetails.contributorType" />,
};
const visibleColumns = ['contributor', 'contributorType'];

function ContributorView({ contributors, contributorNameTypes }) {
  const formatter = { contributorType: ({ contributorNameTypeId: id }) => get(find(contributorNameTypes, { id }), 'name', '') };

  return (
    <MultiColumnList
      columnMapping={columnMapping}
      contentData={contributors}
      formatter={formatter}
      id="list-item-contributors"
      interactive={false}
      visibleColumns={visibleColumns}
    />
  );
}

ContributorView.propTypes = {
  contributors: PropTypes.arrayOf(PropTypes.object),
  contributorNameTypes: PropTypes.arrayOf(PropTypes.object),
};

ContributorView.defaultProps = {
  contributors: [],
  contributorNameTypes: [],
};

export default ContributorView;
