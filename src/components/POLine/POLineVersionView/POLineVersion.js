import PropTypes from 'prop-types';
import { memo, useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  checkScope,
  Col,
  collapseAllSections,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { ORDER_FORMATS } from '@folio/stripes-acq-components';

import { VersionKeyValue } from '../../../common/VersionView';
import {
  ACCORDION_ID,
  ERESOURCES,
  PHRESOURCES,
} from '../const';
import { CostVersionView } from './CostVersionView';
import { EresourcesVersionView } from './EresourcesVersionView';
import { FundDistributionVersionView } from './FundDistributionVersionView';
import { ItemVersionView } from './ItemVersionView';
import { LocationVersionView } from './LocationVersionView/LocationVersionView';
import { OtherVersionView } from './OtherVersionView';
import { PhysicalVersionView } from './PhysicalVersionView';
import { POLineDetailsVersionView } from './POLineDetailsVersionView';
import { VendorVersionView } from './VendorVersionView';

const POLineVersion = ({ version }) => {
  const accordionStatusRef = useRef();

  const orderFormat = version?.orderFormat;
  const showEresources = ERESOURCES.includes(orderFormat);
  const showPhresources = PHRESOURCES.includes(orderFormat);
  const showOther = orderFormat === ORDER_FORMATS.other;

  const shortcuts = [
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
  ];

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <AccordionStatus ref={accordionStatusRef}>
        <Row end="xs">
          <Col xs={12}>
            <ExpandAllButton />
          </Col>
        </Row>

        <AccordionSet>
          <Accordion
            label={<FormattedMessage id="ui-orders.line.accordion.itemDetails" />}
            id="ItemDetails"
          >
            {version?.metadata && <ViewMetaData metadata={version.metadata} />}

            <ItemVersionView version={version} />
          </Accordion>

          <Accordion
            label={<FormattedMessage id="ui-orders.line.accordion.poLine" />}
            id={ACCORDION_ID.poLine}
          >
            <POLineDetailsVersionView version={version} />
          </Accordion>

          <Accordion
            label={<FormattedMessage id="ui-orders.line.accordion.ongoingOrder" />}
            id={ACCORDION_ID.ongoingOrder}
          >
            <Row start="xs">
              <Col xs={12}>
                <VersionKeyValue
                  name="renewalNote"
                  label={<FormattedMessage id="ui-orders.poLine.renewalNote" />}
                  value={version?.renewalNote}
                />
              </Col>
            </Row>
          </Accordion>

          <Accordion
            label={<FormattedMessage id="ui-orders.line.accordion.vendor" />}
            id="Vendor"
          >
            <VendorVersionView version={version} />
          </Accordion>

          <Accordion
            label={<FormattedMessage id="ui-orders.line.accordion.cost" />}
            id="CostDetails"
          >
            <CostVersionView version={version} />
          </Accordion>

          <Accordion
            label={<FormattedMessage id="ui-orders.line.accordion.fund" />}
            id="FundDistribution"
          >
            <FundDistributionVersionView version={version} />
          </Accordion>

          <Accordion
            label={<FormattedMessage id="ui-orders.line.accordion.location" />}
            id={ACCORDION_ID.location}
          >
            <LocationVersionView version={version} />
          </Accordion>

          {showPhresources && (
            <Accordion
              label={<FormattedMessage id="ui-orders.line.accordion.physical" />}
              id={ACCORDION_ID.physical}
            >
              <PhysicalVersionView version={version} />
            </Accordion>
          )}

          {showEresources && (
            <Accordion
              label={<FormattedMessage id="ui-orders.line.accordion.eresource" />}
              id={ACCORDION_ID.eresources}
            >
              <EresourcesVersionView version={version} />
            </Accordion>
          )}

          {showOther && (
            <Accordion
              label={<FormattedMessage id="ui-orders.line.accordion.other" />}
              id={ACCORDION_ID.other}
            >
              <OtherVersionView version={version} />
            </Accordion>
          )}
        </AccordionSet>
      </AccordionStatus>
    </HasCommand>
  );
};

POLineVersion.propTypes = {
  version: PropTypes.object.isRequired,
};

export default memo(POLineVersion);
