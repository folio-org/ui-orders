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

import { POL_FORM_FIELDS } from '../../../../common/constants';
import {
  VersionCheckbox,
  VersionKeyValue,
} from '../../../../common/VersionView';

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
            name={POL_FORM_FIELDS.titleOrPackage}
            label={<FormattedMessage id={`ui-orders.itemDetails.${version?.isPackage ? 'packageName' : 'title'}`} />}
            value={titleValue}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionCheckbox
            name={POL_FORM_FIELDS.isPackage}
            checked={version?.isPackage}
            label={<FormattedMessage id="ui-orders.poLine.package" />}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name={POL_FORM_FIELDS.receivingNote}
            label={<FormattedMessage id="ui-orders.itemDetails.receivingNote" />}
            value={version?.details?.receivingNote}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name={POL_FORM_FIELDS.subscriptionFrom}
            label={<FormattedMessage id="ui-orders.itemDetails.subscriptionFrom" />}
            value={<FolioFormattedDate value={version?.details?.subscriptionFrom} />}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name={POL_FORM_FIELDS.subscriptionTo}
            label={<FormattedMessage id="ui-orders.itemDetails.subscriptionTo" />}
            value={<FolioFormattedDate value={version?.details?.subscriptionTo} />}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name={POL_FORM_FIELDS.subscriptionInterval}
            label={<FormattedMessage id="ui-orders.itemDetails.subscriptionInterval" />}
            value={version?.details?.subscriptionInterval}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name={POL_FORM_FIELDS.publicationDate}
            label={<FormattedMessage id="ui-orders.itemDetails.publicationDate" />}
            value={version?.publicationDate}
          />
        </Col>
        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name={POL_FORM_FIELDS.publisher}
            label={<FormattedMessage id="ui-orders.itemDetails.publisher" />}
            value={version?.publisher}
          />
        </Col>
        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name={POL_FORM_FIELDS.edition}
            label={<FormattedMessage id="ui-orders.itemDetails.edition" />}
            value={version?.edition}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name={POL_FORM_FIELDS.packagePoLineId}
            label={<FormattedMessage id="ui-orders.itemDetails.linkPackage" />}
            value={version?.packagePoLineId}
          />
        </Col>

        <Col xs>
          <VersionCheckbox
            name={POL_FORM_FIELDS.suppressInstanceFromDiscovery}
            checked={version?.suppressInstanceFromDiscovery}
            label={<FormattedMessage id="ui-orders.poLine.suppressFromDiscovery" />}
          />
        </Col>
      </Row>

      <Row start="xs">
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-orders.itemDetails.contributors" />}
            value={(
              <ContributorDetails
                name={POL_FORM_FIELDS.contributors}
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
                name={POL_FORM_FIELDS.productIds}
                productIds={version?.details?.productIds}
              />
            )}
          />
        </Col>
      </Row>

      <Row start="xs">
        <Col xs={12}>
          <VersionKeyValue
            name={POL_FORM_FIELDS.description}
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
