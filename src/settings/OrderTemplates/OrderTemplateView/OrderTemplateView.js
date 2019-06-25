import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { get } from 'lodash';

import {
  Accordion,
  AccordionSet,
  Button,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  Icon,
  Layer,
  Pane,
  Row,
} from '@folio/stripes/components';

import { PODetailsView } from '../../../components/PurchaseOrder/PODetails';
import { SummaryView } from '../../../components/PurchaseOrder/Summary';
import { ItemView } from '../../../components/POLine/Item';
import { POLineDetails } from '../../../components/POLine/POLineDetails';
import { CostView } from '../../../components/POLine/Cost';
import { VendorView } from '../../../components/POLine/Vendor';
import { FundDistributionView } from '../../../components/POLine/FundDistribution';
import { EresourcesView } from '../../../components/POLine/Eresources';
import { PhysicalView } from '../../../components/POLine/Physical';
import LocationView from '../../../components/POLine/Location/LocationView';
import {
  ORDER_TEMPLATES_ACCORDION_TITLES,
  ORDER_TEMPLATES_ACCORDION,
} from '../constants';
import TemplateInformationView from './TemplateInformationView';

class OrderTemplateView extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    template: PropTypes.object,
    rootPath: PropTypes.string,
    addresses: PropTypes.arrayOf(PropTypes.object),
    funds: PropTypes.arrayOf(PropTypes.object),
    identifierTypes: PropTypes.arrayOf(PropTypes.object),
    locations: PropTypes.arrayOf(PropTypes.object),
    materialTypes: PropTypes.arrayOf(PropTypes.object),
    vendors: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    addresses: [],
    funds: [],
    identifierTypes: [],
    locations: [],
    materialTypes: [],
    template: {},
    vendors: [],
  }

  state = {
    sections: {
      [ORDER_TEMPLATES_ACCORDION.TEMPLATE_INFO]: true,
      [ORDER_TEMPLATES_ACCORDION.PO_INFO]: false,
      [ORDER_TEMPLATES_ACCORDION.PO_SUMMARY]: false,
      [ORDER_TEMPLATES_ACCORDION.POL_ITEM_DETAILS]: false,
      [ORDER_TEMPLATES_ACCORDION.POL_DETAILS]: false,
      [ORDER_TEMPLATES_ACCORDION.POL_COST_DETAILS]: false,
      [ORDER_TEMPLATES_ACCORDION.POL_VENDOR]: false,
      [ORDER_TEMPLATES_ACCORDION.POL_FUND_DISTIBUTION]: false,
      [ORDER_TEMPLATES_ACCORDION.POL_ERESOURCES]: false,
      [ORDER_TEMPLATES_ACCORDION.POL_FRESOURCES]: false,
      [ORDER_TEMPLATES_ACCORDION.POL_LOCATION]: false,
    },
    showConfirmDelete: false,
  };

  onToggleSection = ({ id }) => {
    this.setState(({ sections }) => {
      const isSectionOpened = sections[id];

      return {
        sections: {
          ...sections,
          [id]: !isSectionOpened,
        },
      };
    });
  };

  handleExpandAll = (sections) => {
    this.setState({ sections });
  };

  onDeleteOrderTemplate = () => {
    const { onDelete } = this.props;

    this.hideConfirmDelete();
    onDelete();
  };

  showConfirmDelete = () => this.setState({ showConfirmDelete: true });

  hideConfirmDelete = () => this.setState({ showConfirmDelete: false });

  getActionMenu = ({ onToggle }) => {
    const { rootPath, template } = this.props;
    const id = get(template, 'id');

    return (
      <div data-test-view-order-template-actions>
        <Button
          data-test-view-order-template-action-edit
          buttonStyle="dropdownItem"
          to={`${rootPath}/${id}/edit`}
        >
          <Icon icon="edit">
            <FormattedMessage id="ui-orders.button.edit" />
          </Icon>
        </Button>
        <Button
          data-test-view-order-template-action-delete
          buttonStyle="dropdownItem"
          onClick={() => {
            onToggle();
            this.showConfirmDelete();
          }}
        >
          <Icon icon="trash">
            <FormattedMessage id="ui-orders.button.delete" />
          </Icon>
        </Button>
      </div>
    );
  };

  render() {
    const {
      close,
      template,
      addresses,
      funds,
      identifierTypes,
      locations,
      materialTypes,
      vendors,
    } = this.props;
    const { sections, showConfirmDelete } = this.state;
    const orderTemplate = get(template, 'orderTemplate', {});
    const title = get(template, 'title', '');

    return (
      <Layer isOpen>
        <Pane
          actionMenu={this.getActionMenu}
          id="order-settings-order-template-view"
          defaultWidth="fill"
          paneTitle={title}
          dismissible
          onClose={close}
        >

          <Row center="xs">
            <Col xs={12} md={8}>
              <Row end="xs">
                <Col xs={12}>
                  <ExpandAllButton
                    accordionStatus={sections}
                    onToggle={this.handleExpandAll}
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          <Row center="xs">
            <Col xs={12} md={8}>
              <AccordionSet
                accordionStatus={sections}
                onToggle={this.onToggleSection}
              >
                <Accordion
                  label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.TEMPLATE_INFO]}
                  id={ORDER_TEMPLATES_ACCORDION.TEMPLATE_INFO}
                >
                  <TemplateInformationView
                    orderTemplate={orderTemplate}
                  />
                </Accordion>

                <Accordion
                  label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.PO_INFO]}
                  id={ORDER_TEMPLATES_ACCORDION.PO_INFO}
                >
                  <PODetailsView
                    addresses={addresses}
                    order={orderTemplate}
                  />
                </Accordion>

                <Accordion
                  label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.PO_SUMMARY]}
                  id={ORDER_TEMPLATES_ACCORDION.PO_SUMMARY}
                >
                  <SummaryView order={orderTemplate} />
                </Accordion>

                <Accordion
                  label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_ITEM_DETAILS]}
                  id={ORDER_TEMPLATES_ACCORDION.POL_ITEM_DETAILS}
                >
                  <ItemView
                    poLineDetails={orderTemplate}
                    identifierTypes={identifierTypes}
                  />
                </Accordion>

                <Accordion
                  label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_DETAILS]}
                  id={ORDER_TEMPLATES_ACCORDION.POL_DETAILS}
                >
                  <POLineDetails line={orderTemplate} />
                </Accordion>

                <Accordion
                  label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_COST_DETAILS]}
                  id={ORDER_TEMPLATES_ACCORDION.POL_COST_DETAILS}
                >
                  <CostView cost={orderTemplate.cost} />
                </Accordion>

                <Accordion
                  label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_VENDOR]}
                  id={ORDER_TEMPLATES_ACCORDION.POL_VENDOR}
                >
                  <VendorView vendorDetail={orderTemplate.vendorDetail} />
                </Accordion>

                <Accordion
                  label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_FUND_DISTIBUTION]}
                  id={ORDER_TEMPLATES_ACCORDION.POL_FUND_DISTIBUTION}
                >
                  <FundDistributionView
                    line={orderTemplate}
                    funds={funds}
                  />
                </Accordion>

                <Accordion
                  label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_ERESOURCES]}
                  id={ORDER_TEMPLATES_ACCORDION.POL_ERESOURCES}
                >
                  <EresourcesView
                    line={orderTemplate}
                    materialTypes={materialTypes}
                    vendors={vendors}
                  />
                </Accordion>

                <Accordion
                  label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_FRESOURCES]}
                  id={ORDER_TEMPLATES_ACCORDION.POL_FRESOURCES}
                >
                  <PhysicalView
                    materialTypes={materialTypes}
                    physical={orderTemplate.physical}
                    vendors={vendors}
                  />
                </Accordion>

                <Accordion
                  label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_LOCATION]}
                  id={ORDER_TEMPLATES_ACCORDION.POL_LOCATION}
                >
                  <LocationView
                    lineLocations={orderTemplate.locations}
                    locations={locations}
                  />
                </Accordion>
              </AccordionSet>
            </Col>
          </Row>
          {showConfirmDelete && (
            <ConfirmationModal
              id="delete-order-template-modal"
              confirmLabel={<FormattedMessage id="ui-orders.settings.orderTemplates.confirmDelete.confirmLabel" />}
              heading={<FormattedMessage id="ui-orders.settings.orderTemplates.confirmDelete.heading" />}
              message={<FormattedMessage id="ui-orders.settings.orderTemplates.confirmDelete.message" />}
              onCancel={this.hideConfirmDelete}
              onConfirm={this.onDeleteOrderTemplate}
              open
            />
          )}
        </Pane>
      </Layer>
    );
  }
}

export default OrderTemplateView;
