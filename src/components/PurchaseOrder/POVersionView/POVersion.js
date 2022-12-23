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

import { isOngoing } from '../../../common/POFields';
import { OngoingInfoVersionView } from './OngoingInfoVersionView';
import { PODetailsVersionView } from './PODetailsVersionView';
import { SummaryVersionView } from './SummaryVersionView/SummaryVersionView';

const POVersion = ({ version }) => {
  const accordionStatusRef = useRef();

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
            id="purchaseOrder"
            label={<FormattedMessage id="ui-orders.paneBlock.purchaseOrder" />}
          >
            <PODetailsVersionView version={version} />
          </Accordion>

          {isOngoing(version?.orderType) && (
            <Accordion
              id="ongoing"
              label={<FormattedMessage id="ui-orders.paneBlock.ongoingInfo" />}
            >
              <OngoingInfoVersionView version={version} />
            </Accordion>
          )}

          <Accordion
            id="POSummary"
            label={<FormattedMessage id="ui-orders.paneBlock.POSummary" />}
          >
            <SummaryVersionView version={version} />
          </Accordion>
        </AccordionSet>
      </AccordionStatus>
    </HasCommand>
  );
};

POVersion.propTypes = {
  version: PropTypes.object.isRequired,
};

export default memo(POVersion);
