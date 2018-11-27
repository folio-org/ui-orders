import React, { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { get, toString } from 'lodash';
import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import FormatDate from '../../Utils/FormatDate';
import ContributorView from './ContributorView';
import ProductIdDetails from './ProductIdDetails';
import MaterialType from './MaterialType';

class ItemView extends Component {
  static propTypes = {
    parentResources: PropTypes.shape({
      materialTypes: PropTypes.object.isRequired,
    }).isRequired,
    poLineDetails: PropTypes.object.isRequired,
  }

  render() {
    const { parentResources, poLineDetails } = this.props;

    return (
      <Fragment>
        <Row>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.itemDetails.title" />}
              value={get(poLineDetails, 'title')}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.itemDetails.receivingNote" />}
              value={get(poLineDetails, ['details', 'receiving_note'])}
            />
          </Col>
          <Col xs={6}>
            <ContributorView contributors={poLineDetails.contributors} />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.itemDetails.subscriptionFrom" />}
              value={FormatDate(toString(get(poLineDetails, ['details', 'subscription_from'])))}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.itemDetails.publisher" />}
              value={get(poLineDetails, 'publisher')}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.itemDetails.subscriptionInterval" />}
              value={get(poLineDetails, ['details', 'subscription_interval'])}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.itemDetails.publicationDate" />}
              value={FormatDate(toString(get(poLineDetails, 'publication_date')))}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.itemDetails.subscriptionTo" />}
              value={FormatDate(toString(get(poLineDetails, ['details', 'subscription_to'])))}
            />
          </Col>
          <Col xs={6}>
            <MaterialType
              materialTypes={parentResources.materialTypes}
              materialTypesIds={get(poLineDetails, ['details', 'material_types'], [])}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.itemDetails.edition" />}
              value={toString(get(poLineDetails, 'edition'))}
            />
          </Col>
        </Row>
        <Row>
          <ProductIdDetails itemIdDetails={poLineDetails.details.product_ids} />
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.itemDetails.description" />}
              value={toString(get(poLineDetails, 'description'))}
            />
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default ItemView;
