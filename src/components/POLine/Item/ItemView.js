import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { get, toString } from 'lodash';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import {
  ContributorDetails,
  FolioFormattedDate,
  IfVisible,
  ProductIdDetails,
} from '@folio/stripes-acq-components';

import { EditionView } from './EditionField';
import { TitleView } from './TitleField';
import { SubscriptionIntervalView } from './SubscriptionIntervalField';
import LinkToPoLine from '../../LinkToPoLine';

const ItemView = ({ poLineDetails, hiddenFields }) => {
  const contributors = get(poLineDetails, 'contributors', []);

  return (
    <>
      <Row start="xs">
        <Col xs={12}>
          <TitleView poLineDetails={poLineDetails} />
        </Col>

        <IfVisible visible={!hiddenFields.details?.receivingNote}>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.itemDetails.receivingNote" />}
              value={poLineDetails.details?.receivingNote}
            />
          </Col>
        </IfVisible>

        <IfVisible visible={!hiddenFields.details?.subscriptionFrom}>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.itemDetails.subscriptionFrom" />}
              value={<FolioFormattedDate value={get(poLineDetails, ['details', 'subscriptionFrom'])} />}
            />
          </Col>
        </IfVisible>

        <IfVisible visible={!hiddenFields.details?.subscriptionTo}>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.itemDetails.subscriptionTo" />}
              value={<FolioFormattedDate value={get(poLineDetails, ['details', 'subscriptionTo'])} />}
            />
          </Col>
        </IfVisible>

        <IfVisible visible={!hiddenFields.details?.subscriptionInterval}>
          <Col
            xs={6}
            lg={3}
          >
            <SubscriptionIntervalView value={poLineDetails?.details?.subscriptionInterval} />
          </Col>
        </IfVisible>

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
          <EditionView value={poLineDetails?.edition} />
        </Col>

        <IfVisible visible={!hiddenFields.linkPackage}>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.itemDetails.linkPackage" />}
              value={<LinkToPoLine poLineId={poLineDetails?.packagePoLineId} />}
            />
          </Col>
        </IfVisible>

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
        <IfVisible visible={!hiddenFields.details?.description}>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.itemDetails.internalNote" />}
              value={toString(get(poLineDetails, 'description'))}
            />
          </Col>
        </IfVisible>
      </Row>
    </>
  );
};

ItemView.propTypes = {
  poLineDetails: PropTypes.object,
  hiddenFields: PropTypes.object,
};

ItemView.defaultProps = {
  poLineDetails: {},
  hiddenFields: {},
};

export default ItemView;
