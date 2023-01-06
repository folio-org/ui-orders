import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
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

import { VersionKeyValue } from '../../../../common/VersionView';

export const ItemVersionView = ({ version }) => {
  const instanceId = version?.instanceId;
  const title = version?.titleOrPackage;
  const titleValue = instanceId
    ? <Link to={`/inventory/view/${instanceId}`}>{title}</Link>
    : title;

  return (
    <>
      <Row start="xs">
        <Col xs={12}>
          <VersionKeyValue
            name="titleOrPackage"
            label={<FormattedMessage id={`ui-orders.itemDetails.${version?.isPackage ? 'packageName' : 'title'}`} />}
            value={titleValue}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="details.receivingNote"
            label={<FormattedMessage id="ui-orders.itemDetails.receivingNote" />}
            value={version?.details?.receivingNote}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="details.subscriptionFrom"
            label={<FormattedMessage id="ui-orders.itemDetails.subscriptionFrom" />}
            value={<FolioFormattedDate value={version?.details?.subscriptionFrom} />}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="details.subscriptionTo"
            label={<FormattedMessage id="ui-orders.itemDetails.subscriptionTo" />}
            value={<FolioFormattedDate value={version?.details?.subscriptionTo} />}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="details.subscriptionInterval"
            label={<FormattedMessage id="ui-orders.itemDetails.subscriptionInterval" />}
            value={version?.details?.subscriptionInterval}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="publicationDate"
            label={<FormattedMessage id="ui-orders.itemDetails.publicationDate" />}
            value={version?.publicationDate}
          />
        </Col>
        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="publisher"
            label={<FormattedMessage id="ui-orders.itemDetails.publisher" />}
            value={version?.publisher}
          />
        </Col>
        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="edition"
            label={<FormattedMessage id="ui-orders.itemDetails.edition" />}
            value={version?.edition}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="packagePoLineId"
            label={<FormattedMessage id="ui-orders.itemDetails.linkPackage" />}
            value={version?.packagePoLineId}
          />
        </Col>

        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-orders.itemDetails.contributors" />}
            value={(
              <ContributorDetails
                name="contributors"
                contributors={version?.contributors}
              />
            )}
          />
        </Col>
      </Row>

      <Row start="xs">
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-orders.itemDetails.productIds" />}
            value={(
              <ProductIdDetails
                name="details.productIds"
                productIds={version?.details?.productIds}
              />
            )}
          />
        </Col>
      </Row>

      <Row start="xs">
        <Col xs={12}>
          <VersionKeyValue
            name="description"
            label={<FormattedMessage id="ui-orders.itemDetails.internalNote" />}
            value={version?.description}
          />
        </Col>
      </Row>
    </>
  );
};

ItemVersionView.propTypes = {
  version: PropTypes.object.isRequired,
};
