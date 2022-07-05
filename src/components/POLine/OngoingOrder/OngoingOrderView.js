import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import { IfVisible } from '../../../common/IfVisible';

const OngoingOrderView = ({ renewalNote, hiddenFields = {} }) => {
  return (
    <Row start="xs">
      <IfVisible visible={!hiddenFields.renewalNote}>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-orders.poLine.renewalNote" />}
            value={renewalNote}
          />
        </Col>
      </IfVisible>
    </Row>
  );
};

OngoingOrderView.propTypes = {
  renewalNote: PropTypes.string,
  hiddenFields: PropTypes.object,
};

export default OngoingOrderView;
