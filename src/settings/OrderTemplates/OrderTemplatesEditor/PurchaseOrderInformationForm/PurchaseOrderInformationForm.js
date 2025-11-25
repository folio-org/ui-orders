import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
} from 'react';
import { useForm } from 'react-final-form';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import {
  AcqUnitsField,
  FieldOrganization,
  VisibilityControl,
} from '@folio/stripes-acq-components';

import {
  PO_FORM_FIELDS,
  POL_FORM_FIELDS,
} from '../../../../common/constants';
import {
  FieldAssignedTo,
  FieldBillTo,
  FieldIsManualPO,
  FieldIsReEncumber,
  FieldPrefix,
  FieldShipTo,
  FieldSuffix,
} from '../../../../common/POFields';
import { getAddressOptions } from '../../../../common/utils';
import FieldOrderType from '../../../../components/PurchaseOrder/PODetails/FieldOrderType';
import { getOrganizationSelectHandler } from './getOrganizationSelectHandler';

const PurchaseOrderInformationForm = ({
  acqUnitIds,
  addresses,
  prefixesSetting,
  suffixesSetting,
}) => {
  const {
    batch,
    change,
    getState,
  } = useForm();

  const addressOptions = useMemo(() => getAddressOptions(addresses), [addresses]);

  const onManualPOChange = useCallback(({ target: { checked } }) => {
    change(PO_FORM_FIELDS.manualPo, checked);

    if (checked) {
      change(POL_FORM_FIELDS.automaticExport, false);
    }
  }, [change]);

  const onSelectVendor = useCallback((vendor) => {
    if (!vendor?.id) return;

    const formValues = getState().values;

    batch(() => {
      getOrganizationSelectHandler(change, formValues)(vendor);
    });
  }, [batch, change, getState]);

  return (
    <Row>
      <Col
        xs={3}
        data-col-order-template-prefix
      >
        <VisibilityControl name="hiddenFields.poNumberPrefix">
          <FieldPrefix prefixes={prefixesSetting} />
        </VisibilityControl>
      </Col>

      <Col
        xs={3}
        data-col-order-template-suffix
      >
        <VisibilityControl name="hiddenFields.poNumberSuffix">
          <FieldSuffix suffixes={suffixesSetting} />
        </VisibilityControl>
      </Col>

      <Col
        xs={3}
        data-col-order-template-vendor
      >
        <FieldOrganization
          change={change}
          id={getState().values?.vendor}
          labelId="ui-orders.orderDetails.vendor"
          name={PO_FORM_FIELDS.vendor}
          onSelect={onSelectVendor}
          required={false}
        />
      </Col>

      <Col
        xs={3}
        data-col-order-template-assign-to
      >
        <VisibilityControl name="hiddenFields.assignedTo">
          <FieldAssignedTo
            change={change}
            userId={getState().values?.assignedTo}
          />
        </VisibilityControl>
      </Col>

      <Col
        xs={3}
        data-col-order-template-bill-to
      >
        <VisibilityControl name="hiddenFields.billTo">
          <FieldBillTo addresses={addressOptions} />
        </VisibilityControl>
      </Col>

      <Col
        xs={3}
        data-col-order-template-ship-to
      >
        <VisibilityControl name="hiddenFields.shipTo">
          <FieldShipTo addresses={addressOptions} />
        </VisibilityControl>
      </Col>

      <Col
        xs={3}
        data-col-order-template-order-type
      >
        <FieldOrderType required={false} />
      </Col>

      <Col
        xs={3}
        data-col-order-template-order-units
      >
        <VisibilityControl
          control
          name="hiddenFields.acqUnitIds"
        >
          <AcqUnitsField
            id="po-acq-units"
            isFinal
            name={PO_FORM_FIELDS.acqUnitIds}
            preselectedUnits={acqUnitIds}
          />
        </VisibilityControl>
      </Col>

      <Col
        xs={3}
        data-col-order-template-manual
      >
        <VisibilityControl name="hiddenFields.manualPo">
          <FieldIsManualPO onChange={onManualPOChange} />
        </VisibilityControl>
      </Col>

      <Col
        xs={3}
        data-col-order-template-reencumber
      >
        <VisibilityControl name="hiddenFields.reEncumber">
          <FieldIsReEncumber />
        </VisibilityControl>
      </Col>
    </Row>
  );
};

PurchaseOrderInformationForm.propTypes = {
  acqUnitIds: PropTypes.arrayOf(PropTypes.string),
  addresses: PropTypes.arrayOf(PropTypes.object),
  prefixesSetting: PropTypes.arrayOf(PropTypes.object),
  suffixesSetting: PropTypes.arrayOf(PropTypes.object),
};

export default PurchaseOrderInformationForm;
