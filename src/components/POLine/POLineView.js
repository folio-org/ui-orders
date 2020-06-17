import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

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
  MessageBanner,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';
import {
  NotesSmartAccordion,
  ViewMetaData,
} from '@folio/stripes/smart-components';

import {
  FundDistributionView,
  TagsBadge,
} from '@folio/stripes-acq-components';

import {
  isCheckInAvailableForLine,
  isReceiveAvailableForLine,
  isWorkflowStatusClosed,
} from '../PurchaseOrder/util';
import {
  NOTE_TYPES,
  NOTES_ROUTE,
  ORDERS_DOMAIN,
} from '../../common/constants';

import LocationView from './Location/LocationView';
import { POLineDetails } from './POLineDetails';
import CostView from './Cost/CostView';
import VendorView from './Vendor/VendorView';
import EresourcesView from './Eresources/EresourcesView';
import ItemView from './Item/ItemView';
import PhysicalView from './Physical/PhysicalView';
import { OtherView } from './Other';
import POLineInvoicesContainer from './POLineInvoices';
import { POLineAgreementLinesContainer } from './POLineAgreementLines';
import {
  ACCORDION_ID,
  ERESOURCES,
  PHRESOURCES,
  OTHER,
} from './const';
import { FILTERS as ORDER_FILTERS } from '../../OrdersList/constants';

class POLineView extends Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    poURL: PropTypes.string,
    location: ReactRouterPropTypes.location.isRequired,
    locations: PropTypes.arrayOf(PropTypes.object),
    order: PropTypes.object,
    line: PropTypes.object,
    match: ReactRouterPropTypes.match.isRequired,
    materialTypes: PropTypes.arrayOf(PropTypes.object),
    onClose: PropTypes.func,
    editable: PropTypes.bool,
    goToOrderDetails: PropTypes.func,
    deleteLine: PropTypes.func,
    tagsToggle: PropTypes.func.isRequired,
  }

  static defaultProps = {
    locations: [],
    materialTypes: [],
    editable: true,
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
        [ACCORDION_ID.notes]: true,
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
    const { match: { params: { lineId } }, history, location, order, line } = this.props;
    const search = lineId ? location.search : `qindex=${ORDER_FILTERS.PO_NUMBER}&query=${order.poNumber}`;

    history.push({
      pathname: `/orders/view/${order.id}/po-line/edit/${line.id}`,
      search,
    });
  };

  mountDeleteLineConfirm = () => this.setState({ showConfirmDelete: true });

  unmountDeleteLineConfirm = () => this.setState({ showConfirmDelete: false });

  onConfirmDelete = () => {
    this.unmountDeleteLineConfirm();
    this.props.deleteLine();
  }

  getActionMenu = ({ onToggle }) => {
    const { goToOrderDetails, editable, line, order } = this.props;

    const isReceiveButtonVisible = isReceiveAvailableForLine(line, order);
    const isCheckInButtonVisible = isCheckInAvailableForLine(line, order);

    // TODO: unify actions after Order Lines list is implemented fully
    return (
      <MenuSection id="data-test-line-details-actions">
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
        <IfPermission perm="ui-receiving.view">
          {(isReceiveButtonVisible || isCheckInButtonVisible) && (
            <Button
              buttonStyle="dropdownItem"
              data-test-line-receive-button
              to={`/receiving?qindex=poLine.poLineNumber&query=${line.poLineNumber}`}
            >
              <FormattedMessage id="ui-orders.paneBlock.receiveBtn" />
            </Button>
          )}
        </IfPermission>
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
      </MenuSection>
    );
  };

  render() {
    const {
      onClose,
      poURL,
      order,
      line,
      materialTypes,
      locations,
      tagsToggle,
    } = this.props;
    const tags = get(line, ['tags', 'tagList'], []);

    const firstMenu = (
      <PaneMenu>
        <IconButton
          icon="arrow-left"
          id="clickable-backToPO"
          onClick={onClose}
          title="Back to PO"
        />
      </PaneMenu>);
    const lastMenu = (
      <PaneMenu>
        <TagsBadge
          tagsToggle={tagsToggle}
          tagsQuantity={tags.length}
        />
      </PaneMenu>
    );

    const orderFormat = get(line, 'orderFormat');
    const poLineNumber = line.poLineNumber;
    const showEresources = ERESOURCES.includes(orderFormat);
    const showPhresources = PHRESOURCES.includes(orderFormat);
    const showOther = orderFormat === OTHER;
    const estimatedPrice = get(line, ['cost', 'poLineEstimatedPrice'], 0);
    const fundDistributions = get(line, 'fundDistribution');
    const currency = get(line, 'cost.currency');
    const metadata = get(line, 'metadata');
    const isClosedOrder = isWorkflowStatusClosed(order);

    return (
      <Pane
        defaultWidth="fill"
        firstMenu={poURL ? firstMenu : null}
        actionMenu={this.getActionMenu}
        dismissible={!poURL}
        onClose={onClose}
        id="pane-poLineDetails"
        lastMenu={lastMenu}
        paneTitle="PO Line Details"
      >
        <AccordionSet
          accordionStatus={this.state.sections}
          onToggle={this.onToggleSection}
        >
          <Row end="xs">
            <Col xs={10}>
              {isClosedOrder && (
                <MessageBanner type="warning">
                  <FormattedMessage
                    id="ui-orders.line.closedOrderMessage"
                    values={{ reason: order.closeReason?.reason }}
                  />
                </MessageBanner>
              )}
            </Col>
            <Col xs={2}>
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

            <ItemView poLineDetails={line} />
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
            <CostView
              cost={line.cost}
              isPackage={line.isPackage}
              orderFormat={orderFormat}
            />
          </Accordion>
          <Accordion
            label={<FormattedMessage id="ui-orders.line.accordion.fund" />}
            id="FundDistribution"
          >
            <FundDistributionView
              currency={currency}
              fundDistributions={fundDistributions}
              totalAmount={estimatedPrice}
            />
          </Accordion>
          <Accordion
            label={<FormattedMessage id="ui-orders.line.accordion.location" />}
            id={ACCORDION_ID.location}
          >
            <LocationView
              lineLocations={line.locations}
              locations={locations}
            />
          </Accordion>
          {showPhresources && (
            <Accordion
              label={<FormattedMessage id="ui-orders.line.accordion.physical" />}
              id={ACCORDION_ID.physical}
            >
              <PhysicalView
                materialTypes={materialTypes}
                physical={get(line, 'physical', {})}
              />
            </Accordion>
          )}
          {showEresources && (
            <Accordion
              label={<FormattedMessage id="ui-orders.line.accordion.eresource" />}
              id={ACCORDION_ID.eresources}
            >
              <EresourcesView
                line={line}
                materialTypes={materialTypes}
                order={order}
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
              />
            </Accordion>
          )}
          <Accordion
            label={<FormattedMessage id="ui-orders.line.accordion.vendor" />}
            id="Vendor"
          >
            <VendorView vendorDetail={line.vendorDetail} />
          </Accordion>
          <IfPermission perm="ui-notes.item.view">
            <NotesSmartAccordion
              domainName={ORDERS_DOMAIN}
              entityId={line.id}
              entityName={poLineNumber}
              entityType={NOTE_TYPES.poLine}
              hideAssignButton
              id={ACCORDION_ID.notes}
              onToggle={this.onToggleSection}
              pathToNoteCreate={`${NOTES_ROUTE}/new`}
              pathToNoteDetails={NOTES_ROUTE}
            />
          </IfPermission>
          <POLineInvoicesContainer
            label={<FormattedMessage id="ui-orders.line.accordion.relatedInvoices" />}
            lineId={get(line, 'id')}
          />
          <POLineAgreementLinesContainer
            label={<FormattedMessage id="ui-orders.line.accordion.relatedAgreementLines" />}
            lineId={line.id}
          />
        </AccordionSet>
        {this.state.showConfirmDelete && (
          <ConfirmationModal
            id="delete-line-confirmation"
            confirmLabel={<FormattedMessage id="ui-orders.order.delete.confirmLabel" />}
            heading={<FormattedMessage id="ui-orders.order.delete.heading" values={{ orderNumber: poLineNumber }} />}
            message={<FormattedMessage id="ui-orders.line.delete.message" />}
            onCancel={this.unmountDeleteLineConfirm}
            onConfirm={this.onConfirmDelete}
            open
          />
        )}
      </Pane>
    );
  }
}

export default withRouter(POLineView);
