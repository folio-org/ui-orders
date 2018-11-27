import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { get, toString } from 'lodash';
import { MultiColumnList } from '@folio/stripes/components';

class LineListing extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    poLines: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.onSelectRow = this.onSelectRow.bind(this);
  }

  onSelectRow = (e, meta) => {
    const { match, history } = this.props;
    const url = match.url;
    history.push(`${url}/po-line/view/${meta.id}`);
  }

  render() {
    const { poLines } = this.props;
    const resultsFormatter = {
      'po_line_number': item => toString(get(item, ['po_line_number'], '')),
      'acquisition_method': item => toString(get(item, ['acquisition_method'], '')),
      'owner': item => toString(get(item, ['owner'], '')),
      'po_line_description': item => toString(get(item, ['po_line_description'], '')),
    };
    return (
      <div>
        <MultiColumnList
          contentData={poLines}
          formatter={resultsFormatter}
          onRowClick={this.onSelectRow}
          visibleColumns={['po_line_number', 'acquisition_method', 'owner', 'po_line_description']}
          columnMapping={{
            po_line_number: <FormattedMessage id="ui-orders.lineListing.lineNumber" />,
            acquisition_method: <FormattedMessage id="ui-orders.lineListing.acquisitionMethod" />,
            owner: <FormattedMessage id="ui-orders.lineListing.owner" />,
            po_line_description: <FormattedMessage id="ui-orders.lineListing.lineDescription" />,
          }}
        />
      </div>
    );
  }
}

export default LineListing;
