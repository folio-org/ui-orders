import get from 'lodash/get';
import toString from 'lodash/toString';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Checkbox,
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

import LinkToPoLine from '../../LinkToPoLine';
import { EditionView } from './EditionField';
import { SubscriptionIntervalView } from './SubscriptionIntervalField';
import { TitleView } from './TitleField';

const DEFAULT_HIDDEN_FIELDS = {};
const DEFAULT_PO_LINE_DETAILS = {};

const ItemView = ({
  hiddenFields = DEFAULT_HIDDEN_FIELDS,
  poLineDetails = DEFAULT_PO_LINE_DETAILS,
}) => {
  const contributors = get(poLineDetails, 'contributors', []);

  return (
    <>
      <Row start="xs">
        <Col xs={12}>
          <TitleView poLineDetails={poLineDetails} />
        </Col>

        <IfVisible visible={!hiddenFields.isPackage}>
          <Col
            xs={6}
            lg={3}
          >
            <Checkbox
              checked={poLineDetails.isPackage}
              disabled
              label={<FormattedMessage id="ui-orders.poLine.package" />}
              vertical
            />
          </Col>
        </IfVisible>

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

        <IfVisible visible={!hiddenFields.details?.publicationDate}>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.itemDetails.publicationDate" />}
              value={get(poLineDetails, 'publicationDate')}
            />
          </Col>
        </IfVisible>

        <IfVisible visible={!hiddenFields.details?.publisher}>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.itemDetails.publisher" />}
              value={get(poLineDetails, 'publisher')}
            />
          </Col>
        </IfVisible>

        <IfVisible visible={!hiddenFields.details?.edition}>
          <Col
            xs={6}
            lg={3}
          >
            <EditionView value={poLineDetails?.edition} />
          </Col>
        </IfVisible>

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

        <IfVisible visible={!hiddenFields.suppressInstanceFromDiscovery}>
          <Col xs>
            <Checkbox
              checked={poLineDetails.suppressInstanceFromDiscovery}
              disabled
              label={<FormattedMessage id="ui-orders.poLine.suppressFromDiscovery" />}
              vertical
            />
          </Col>
        </IfVisible>
      </Row>

      <Row start="xs">
        <IfVisible visible={!hiddenFields.details?.contributors}>
          <Col xs={12}>
            <KeyValue label={<FormattedMessage id="ui-orders.itemDetails.contributors" />}>
              <ContributorDetails contributors={contributors} />
            </KeyValue>
          </Col>
        </IfVisible>
      </Row>

      <IfVisible visible={!hiddenFields.details?.productIds}>
        <Row start="xs">
          <Col xs={12}>
            <KeyValue label={<FormattedMessage id="ui-orders.itemDetails.productIds" />}>
              <ProductIdDetails productIds={get(poLineDetails, ['details', 'productIds'], [])} />
            </KeyValue>
          </Col>
        </Row>
      </IfVisible>

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
  hiddenFields: PropTypes.object,
  poLineDetails: PropTypes.object,
};

export default ItemView;
