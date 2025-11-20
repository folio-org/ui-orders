import get from 'lodash/get';
import toString from 'lodash/toString';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import {
  FolioFormattedDate,
  IfVisible,
  OrganizationValue,
} from '@folio/stripes-acq-components';

const DEFAULT_MATERIAL_TYPES = [];
const DEFAULT_PHYSICAL = {};
const DEFAULT_HIDDEN_FIELDS = {};

const PhysicalView = ({
  hiddenFields = DEFAULT_HIDDEN_FIELDS,
  materialTypes = DEFAULT_MATERIAL_TYPES,
  physical = DEFAULT_PHYSICAL,
}) => {
  const materialSupplierId = get(physical, 'materialSupplier');
  const materialTypeId = get(physical, 'materialType');
  const materialType = materialTypes.find(type => materialTypeId === type.id);

  return (
    <Row start="xs">
      <IfVisible visible={!hiddenFields.physical?.materialSupplier}>
        <Col
          xs={6}
          lg={3}
        >
          <OrganizationValue
            id={materialSupplierId}
            label={<FormattedMessage id="ui-orders.physical.materialSupplier" />}
          />
        </Col>
      </IfVisible>

      <IfVisible visible={!hiddenFields.physical?.receiptDue}>
        <Col
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-orders.physical.receiptDue" />}
            value={<FolioFormattedDate value={get(physical, 'receiptDue')} />}
          />
        </Col>
      </IfVisible>

      <IfVisible visible={!hiddenFields.physical?.expectedReceiptDate}>
        <Col
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-orders.physical.expectedReceiptDate" />}
            value={<FolioFormattedDate value={get(physical, 'expectedReceiptDate')} />}
          />
        </Col>
      </IfVisible>

      <Col
        xs={6}
        lg={3}
      >
        <KeyValue
          label={<FormattedMessage id="ui-orders.physical.volumes" />}
          value={toString(get(physical, 'volumes'))}
        />
      </Col>

      <IfVisible visible={!hiddenFields.physical?.createInventory}>
        <Col
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-orders.physical.createInventory" />}
            value={get(physical, 'createInventory')}
          />
        </Col>
      </IfVisible>

      <IfVisible visible={!hiddenFields.physical?.materialType}>
        <Col
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-orders.poLine.materialType" />}
            value={get(materialType, 'name', '')}
          />
        </Col>
      </IfVisible>
    </Row>
  );
};

PhysicalView.propTypes = {
  hiddenFields: PropTypes.object,
  materialTypes: PropTypes.arrayOf(PropTypes.object),
  physical: PropTypes.object,
};

export default PhysicalView;
