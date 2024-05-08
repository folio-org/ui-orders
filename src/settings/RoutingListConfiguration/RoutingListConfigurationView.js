import get from 'lodash/get';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import {
  useHistory,
  useLocation,
} from 'react-router';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  Col,
  ExpandAllButton,
  HasCommand,
  KeyValue,
  Pane,
  Row,
  checkScope,
  collapseAllSections,
  expandAllSections,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';
import { ViewMetaData } from '@folio/stripes/smart-components';

import RoutingListConfigurationEmailTemplate from './RoutingListConfigurationEmailTemplate';

const RoutingListConfigurationView = (props) => {
  const accordionStatusRef = useRef();
  const location = useLocation();
  const history = useHistory();
  const stripes = useStripes();
  const {
    listConfig,
    intl: {
      formatMessage,
    },
  } = props;

  const emailTemplate = get(listConfig, 'localizedTemplates.en.body', '');
  const editable = stripes.hasPerm('ui-orders.settings.all');
  const onEdit = () => history.push(`${location.pathname}/edit`);

  const editIcon = (
    <Button
      buttonStyle="primary"
      onClick={onEdit}
      disabled={!editable}
      marginBottom0
    >
      <FormattedMessage id="stripes-core.button.edit" />
    </Button>
  );

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
      <Pane
        data-testid="routingListConfigurationTemplatePane"
        id="routing-list-configuration-template-pane"
        defaultWidth="fill"
        paneTitle={formatMessage({ id: 'ui-orders.settings.routing.listConfiguration' })}
        lastMenu={editIcon}
      >
        <AccordionStatus>
          <Row end="xs">
            <Col data-test-expand-all>
              <ExpandAllButton />
            </Col>
          </Row>
          <AccordionSet>
            <Accordion label={formatMessage({ id: 'ui-circulation.settings.patronNotices.generalInformation' })}>
              <AccordionSet>
                {listConfig.metadata && <ViewMetaData metadata={listConfig.metadata} />}
              </AccordionSet>
              <Row>
                <Col
                  xs={12}
                  data-testid="routingListConfigurationDescription"
                >
                  <KeyValue
                    label={<FormattedMessage id="ui-orders.settings.routing.listConfiguration.description" />}
                    value={listConfig.description}
                  />
                </Col>
              </Row>
            </Accordion>
            <Accordion label={formatMessage({ id: 'ui-orders.settings.routing.listConfiguration.templateContent' })}>
              <RoutingListConfigurationEmailTemplate
                listConfig={listConfig}
                emailTemplate={emailTemplate}
              />
            </Accordion>
          </AccordionSet>
        </AccordionStatus>
      </Pane>
    </HasCommand>
  );
};

RoutingListConfigurationView.propTypes = {
  intl: PropTypes.object.isRequired,
  listConfig: PropTypes.object,
};

RoutingListConfigurationView.defaultProps = {
  listConfig: {},
};

export default injectIntl(RoutingListConfigurationView);
