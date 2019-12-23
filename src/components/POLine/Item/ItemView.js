import React, { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { get, toString } from 'lodash';
import { Link } from 'react-router-dom';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import {
  ContributorDetails,
  FolioFormattedDate,
  ProductIdDetails,
} from '@folio/stripes-acq-components';

class ItemView extends Component {
  static propTypes = {
    poLineDetails: PropTypes.object,
  }

  static defaultProps = {
    poLineDetails: {},
  }

  render() {
    const { poLineDetails } = this.props;
    const instanceId = get(poLineDetails, 'instanceId');
    const title = get(poLineDetails, 'titleOrPackage');
    const titleValue = instanceId
      ? <Link to={`/inventory/view/${instanceId}`}>{title}</Link>
      : title;
    const contributors = get(poLineDetails, 'contributors', []);

    return (
      <Fragment>
        <Row start="xs">
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.itemDetails.title" />}
              value={titleValue}
            />
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.itemDetails.receivingNote" />}
              value={get(poLineDetails, ['details', 'receivingNote'])}
            />
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.itemDetails.subscriptionFrom" />}
              value={<FolioFormattedDate value={get(poLineDetails, ['details', 'subscriptionFrom'])} />}
            />
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.itemDetails.subscriptionTo" />}
              value={<FolioFormattedDate value={get(poLineDetails, ['details', 'subscriptionTo'])} />}
            />
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.itemDetails.subscriptionInterval" />}
              value={get(poLineDetails, ['details', 'subscriptionInterval'])}
            />
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.itemDetails.publicationDate" />}
              value={get(poLineDetails, 'publicationDate')}
            />
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.itemDetails.publisher" />}
              value={get(poLineDetails, 'publisher')}
            />
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.itemDetails.edition" />}
              value={toString(get(poLineDetails, 'edition'))}
            />
          </Col>
          <Col xs={12}>
            <KeyValue label={<FormattedMessage id="ui-orders.itemDetails.contributors" />}>
              <ContributorDetails contributors={contributors} />
            </KeyValue>
          </Col>
        </Row>
        <Row start="xs">
          <Col xs={12}>
            <KeyValue label={<FormattedMessage id="ui-orders.itemDetails.productIds" />}>
              <ProductIdDetails productIds={get(poLineDetails, ['details', 'productIds'], [])} />
            </KeyValue>
          </Col>
        </Row>
        <Row start="xs">
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.itemDetails.internalNote" />}
              value={toString(get(poLineDetails, 'description'))}
            />
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default ItemView;
