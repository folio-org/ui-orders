import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import {
  FolioFormattedDate,
} from '@folio/stripes-acq-components';

import { VersionKeyValue } from '../../../../common/VersionView';

export const PhysicalVersionView = ({ version }) => {
  const physical = version?.physical;

  return (
    <Row start="xs">
      <Col
        xs={6}
        lg={3}
      >
        <VersionKeyValue
          name="physical.materialSupplier"
          label={<FormattedMessage id="ui-orders.physical.materialSupplier" />}
          value={physical?.materialSupplier}
        />
      </Col>

      <Col
        xs={6}
        lg={3}
      >
        <VersionKeyValue
          name="physical.receiptDue"
          label={<FormattedMessage id="ui-orders.physical.receiptDue" />}
          value={<FolioFormattedDate value={physical?.receiptDue} />}
        />
      </Col>

      <Col
        xs={6}
        lg={3}
      >
        <VersionKeyValue
          name="physical.expectedReceiptDate"
          label={<FormattedMessage id="ui-orders.physical.expectedReceiptDate" />}
          value={<FolioFormattedDate value={physical?.expectedReceiptDate} />}
        />
      </Col>

      <Col
        xs={6}
        lg={3}
      >
        <VersionKeyValue
          label={<FormattedMessage id="ui-orders.physical.volumes" />}
          name="physical.volumes"
          value={physical?.volumes}
          multiple
        />
      </Col>

      <Col
        xs={6}
        lg={3}
      >
        <VersionKeyValue
          name="physical.createInventory"
          label={<FormattedMessage id="ui-orders.physical.createInventory" />}
          value={physical?.createInventory}
        />
      </Col>

      <Col
        xs={6}
        lg={3}
      >
        <VersionKeyValue
          name="physical.materialType"
          label={<FormattedMessage id="ui-orders.poLine.materialType" />}
          value={physical?.materialType}
        />
      </Col>
    </Row>
  );
};

PhysicalVersionView.propTypes = {
  version: PropTypes.object.isRequired,
};
