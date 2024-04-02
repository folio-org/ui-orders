import get from 'lodash/get';
import PropTypes from 'prop-types';
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
  KeyValue,
  Pane,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

import RoutingListConfigurationEmailTemplate from './RoutingListConfigurationEmailTemplate';

const RoutingListConfigurationView = (props) => {
  const location = useLocation();
  const history = useHistory();
  const {
    listConfig,
    intl: {
      formatMessage,
    },
  } = props;

  const emailTemplate = get(listConfig, 'localizedTemplates.en.body', '');

  const onEdit = () => {
    const editPath = `${location.pathname}/edit`;

    history.push(editPath);
  };

  const renderEditIcon = () => {
    return (
      <Button
        buttonStyle="primary"
        onClick={onEdit}
        marginBottom0
      >
        <FormattedMessage id="stripes-core.button.edit" />
      </Button>
    );
  };

  return (
    <Pane
      data-testid="routingListConfigurationTemplatePane"
      id="routing-list-configuration-template-pane"
      defaultWidth="fill"
      paneTitle={formatMessage({ id: 'ui-orders.settings.routing.listConfiguration' })}
      lastMenu={renderEditIcon()}
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
              <ViewMetaData metadata={listConfig.metadata} />
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
