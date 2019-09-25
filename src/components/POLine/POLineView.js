import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { IfPermission } from '@folio/stripes/core';
import {
  Accordion,
  AccordionSet,
  Button,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  Icon,
  IconButton,
  MenuSection,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

import { FundDistributionView } from '@folio/stripes-acq-components';

import {
  isCheckInAvailableForLine,
  isReceiveAvailableForLine,
} from '../PurchaseOrder/util';
import { WORKFLOW_STATUS } from '../PurchaseOrder/Summary/FieldWorkflowStatus';

import LocationView from './Location/LocationView';
import { POLineDetails } from './POLineDetails';
import CostView from './Cost/CostView';
import VendorView from './Vendor/VendorView';
import EresourcesView from './Eresources/EresourcesView';
import ItemView from './Item/ItemView';
import PhysicalView from './Physical/PhysicalView';
import { OtherView } from './Other';
import POLineInvoicesContainer from './POLineInvoices';
import {
  ACCORDION_ID,
  ERESOURCES,
  PHRESOURCES,
  OTHER,
} from './const';
import { FILTERS } from '../../OrdersList';

class POLineView extends Component {
  static propTypes = {
    poURL: PropTypes.string,
    locations: PropTypes.arrayOf(PropTypes.object),
    order: PropTypes.object,
    line: PropTypes.object,
    materialTypes: PropTypes.arrayOf(PropTypes.object),
    vendors: PropTypes.arrayOf(PropTypes.object),
    receivingURL: PropTypes.string.isRequired,
    checkinURL: PropTypes.string.isRequired,
    onClose: PropTypes.func,
    editable: PropTypes.bool,
    goToOrderDetails: PropTypes.func,
    queryMutator: PropTypes.object,
    deleteLine: PropTypes.func,
    identifierTypes: PropTypes.arrayOf(PropTypes.object),
    contributorNameTypes: PropTypes.arrayOf(PropTypes.object),
  }

  static defaultProps = {
    locations: [],
    materialTypes: [],
    vendors: [],
    editable: true,
    identifierTypes: [],
    contributorNameTypes: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      sections: {
        CostDetails: true,
        Vendor: true,
        FundDistribution: true,
        ItemDetails: true,
        Renewal: true,
        [ACCORDION_ID.eresources]: true,
        [ACCORDION_ID.location]: true,
        [ACCORDION_ID.other]: true,
        [ACCORDION_ID.physical]: true,
        [ACCORDION_ID.relatedInvoices]: true,
      },
      showConfirmDelete: false,
    };
  }

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
  }

  handleExpandAll = (sections) => {
    this.setState({ sections });
  }

  onEditPOLine = (e) => {
    if (e) e.preventDefault();
    const { queryMutator, order, line } = this.props;

    queryMutator.update({
      _path: `/orders/view/${order.id}/po-line/view/${line.id}`,
      layer: 'edit-po-line',
      filters: `${FILTERS.STATUS}.${WORKFLOW_STATUS.open},${FILTERS.STATUS}.${WORKFLOW_STATUS.pending}`,
    });
  };

  mountDeleteLineConfirm = () => this.setState({ showConfirmDelete: true });

  unmountDeleteLineConfirm = () => this.setState({ showConfirmDelete: false });

  getActionMenu = ({ onToggle }) => {
    const { goToOrderDetails, editable } = this.props;

    // TODO: unify actions after Order Lines list is implemented fully
    return (
      <MenuSection id="data-test-line-details-actions">
        <IfPermission perm="orders.po-lines.item.delete">
          <Button
            buttonStyle="dropdownItem"
            data-test-button-delete-line
            onClick={() => {
              onToggle();
              this.mountDeleteLineConfirm();
            }}
          >
            <Icon size="small" icon="trash">
              <FormattedMessage id="ui-orders.button.delete" />
            </Icon>
          </Button>
        </IfPermission>
        {editable && (
          <IfPermission perm="orders.po-lines.item.put">
            <Button
              buttonStyle="dropdownItem"
              data-test-button-edit-line
              onClick={() => {
                onToggle();
                this.onEditPOLine();
              }}
            >
              <Icon size="small" icon="edit">
                <FormattedMessage id="ui-orders.button.edit" />
              </Icon>
            </Button>
          </IfPermission>
        )}
        {goToOrderDetails && (
          <Button
            data-test-line-details-actions-view-po
            buttonStyle="dropdownItem"
            onClick={() => {
              onToggle();
              goToOrderDetails();
            }}
          >
            <Icon icon="eye-open">
              <FormattedMessage id="ui-orders.poLine.actions.viewPO" />
            </Icon>
          </Button>
        )}
      </MenuSection>
    );
  };

  backToOrder = () => {
    const { poURL, queryMutator } = this.props;

    queryMutator.update({ _path: poURL });
  }

  render() {
    const {
      onClose,
      poURL,
      receivingURL,
      checkinURL,
      order,
      line,
      materialTypes,
      locations,
      vendors,
      editable,
      deleteLine,
      identifierTypes,
      contributorNameTypes,
    } = this.props;

    const firstMenu = (
      <PaneMenu>
        <IconButton
          icon="arrow-left"
          id="clickable-backToPO"
          onClick={this.backToOrder}
          title="Back to PO"
        />
      </PaneMenu>);
    const lastMenu = (
      <PaneMenu>
        <IfPermission perm="orders.po-lines.item.put">
          {
            editable && (
              <IconButton
                icon="edit"
                id="clickable-edit-po-line"
                onClick={this.onEditPOLine}
                title="Edit PO Line"
              />
            )
          }
        </IfPermission>
      </PaneMenu>
    );

    if (!(line && order)) {
      return (
        <Pane id="pane-poLineDetails" defaultWidth="fill" paneTitle="PO Line Details" lastMenu={lastMenu} dismissible>
          <div style={{ paddingTop: '1rem' }}><Icon icon="spinner-ellipsis" width="100px" /></div>
        </Pane>
      );
    }

    const orderFormat = get(line, 'orderFormat');
    const poLineNumber = line.poLineNumber;
    const showEresources = ERESOURCES.includes(orderFormat);
    const showPhresources = PHRESOURCES.includes(orderFormat);
    const showOther = orderFormat === OTHER;
    const isReceiveButtonVisible = isReceiveAvailableForLine(line, order);
    const isCheckInButtonVisible = isCheckInAvailableForLine(line, order);
    const isWorkflowStatusOpen = order.workflowStatus === WORKFLOW_STATUS.open;
    const checkInLocation = isWorkflowStatusOpen ? `${checkinURL}/items` : `${checkinURL}/history`;
    const receivingLocation = isWorkflowStatusOpen ? receivingURL : `${receivingURL}-history`;
    const estimatedPrice = get(line, ['cost', 'poLineEstimatedPrice'], 0);
    const fundDistributions = get(line, 'fundDistribution', []);

    const metadata = get(line, 'metadata');

    return (
      <Pane
        defaultWidth="fill"
        firstMenu={poURL ? firstMenu : null}
        actionMenu={this.getActionMenu}
        dismissible={Boolean(onClose)}
        onClose={onClose}
        id="pane-poLineDetails"
        lastMenu={lastMenu}
        paneTitle="PO Line Details"
      >
        <Row end="xs">
          <Col xs>
            <IfPermission perm="orders.receiving.collection.post">
              {isReceiveButtonVisible && (
                <div>
                  <Button
                    buttonStyle="primary"
                    data-test-line-receive-button
                    to={receivingLocation}
                  >
                    <FormattedMessage id="ui-orders.paneBlock.receiveBtn" />
                  </Button>
                </div>
              )}
            </IfPermission>

            <IfPermission perm="orders.check-in.collection.post">
              {isCheckInButtonVisible && (
                <div>
                  <Button
                    buttonStyle="primary"
                    data-test-line-check-in-button
                    to={checkInLocation}
                  >
                    <FormattedMessage id="ui-orders.paneBlock.checkInBtn" />
                  </Button>
                </div>
              )}
            </IfPermission>
          </Col>
        </Row>
        <AccordionSet
          accordionStatus={this.state.sections}
          onToggle={this.onToggleSection}
        >
          <Row end="xs">
            <Col xs>
              <ExpandAllButton
                accordionStatus={this.state.sections}
                onToggle={this.handleExpandAll}
              />
            </Col>
          </Row>
          <Accordion
            label={<FormattedMessage id="ui-orders.line.accordion.itemDetails" />}
            id="ItemDetails"
          >
            {metadata && <ViewMetaData metadata={metadata} />}

            <ItemView
              identifierTypes={identifierTypes}
              poLineDetails={line}
              contributorNameTypes={contributorNameTypes}
            />
          </Accordion>
          <Accordion
            label={<FormattedMessage id="ui-orders.line.accordion.poLine" />}
            id={ACCORDION_ID.poLine}
          >
            <POLineDetails line={line} />
          </Accordion>
          <Accordion
            label={<FormattedMessage id="ui-orders.line.accordion.cost" />}
            id="CostDetails"
          >
            <CostView cost={line.cost} />
          </Accordion>
          <Accordion
            label={<FormattedMessage id="ui-orders.line.accordion.vendor" />}
            id="Vendor"
          >
            <VendorView vendorDetail={line.vendorDetail} />
          </Accordion>
          <Accordion
            label={<FormattedMessage id="ui-orders.line.accordion.fund" />}
            id="FundDistribution"
          >
            <FundDistributionView
              fundDistributions={fundDistributions}
              totalAmount={estimatedPrice}
            />
          </Accordion>
          {showEresources && (
            <Accordion
              label={<FormattedMessage id="ui-orders.line.accordion.eresource" />}
              id={ACCORDION_ID.eresources}
            >
              <EresourcesView
                line={line}
                materialTypes={materialTypes}
                order={order}
                vendors={vendors}
              />
            </Accordion>
          )}
          {showPhresources && (
            <Accordion
              label={<FormattedMessage id="ui-orders.line.accordion.physical" />}
              id={ACCORDION_ID.physical}
            >
              <PhysicalView
                materialTypes={materialTypes}
                physical={get(line, 'physical', {})}
                vendors={vendors}
              />
            </Accordion>
          )}
          {showOther && (
            <Accordion
              label={<FormattedMessage id="ui-orders.line.accordion.other" />}
              id={ACCORDION_ID.other}
            >
              <OtherView
                materialTypes={materialTypes}
                physical={get(line, 'physical', {})}
                vendors={vendors}
              />
            </Accordion>
          )}
          <POLineInvoicesContainer
            label={<FormattedMessage id="ui-orders.line.accordion.relatedInvoices" />}
            lineId={get(line, 'id')}
            vendors={vendors}
          />
          <Accordion
            label={<FormattedMessage id="ui-orders.line.accordion.location" />}
            id={ACCORDION_ID.location}
          >
            <LocationView
              lineLocations={line.locations}
              locations={locations}
            />
          </Accordion>
        </AccordionSet>
        {this.state.showConfirmDelete && (
          <ConfirmationModal
            id="delete-line-confirmation"
            confirmLabel={<FormattedMessage id="ui-orders.order.delete.confirmLabel" />}
            heading={<FormattedMessage id="ui-orders.order.delete.heading" values={{ orderNumber: poLineNumber }} />}
            message={<FormattedMessage id="ui-orders.line.delete.message" />}
            onCancel={this.unmountDeleteLineConfirm}
            onConfirm={deleteLine}
            open
          />
        )}
      </Pane>
    );
  }
}

export default POLineView;
