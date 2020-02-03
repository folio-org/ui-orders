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
import {
  ACCORDION_ID,
  ERESOURCES,
  PHRESOURCES,
  OTHER,
} from './const';
import { FILTERS as ORDER_FILTERS } from '../../OrdersList/constants';

class POLineView extends Component {
  static propTypes = {
    poURL: PropTypes.string,
    locations: PropTypes.arrayOf(PropTypes.object),
    order: PropTypes.object,
    line: PropTypes.object,
    materialTypes: PropTypes.arrayOf(PropTypes.object),
    vendors: PropTypes.arrayOf(PropTypes.object),
    onClose: PropTypes.func,
    editable: PropTypes.bool,
    goToOrderDetails: PropTypes.func,
    queryMutator: PropTypes.object,
    deleteLine: PropTypes.func,
    tagsToggle: PropTypes.func.isRequired,
  }

  static defaultProps = {
    locations: [],
    materialTypes: [],
    vendors: [],
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
    const { queryMutator, order, line } = this.props;

    queryMutator.update({
      _path: `/orders/view/${order.id}/po-line/view/${line.id}`,
      layer: 'edit-po-line',
      filters: `${ORDER_FILTERS.PO_NUMBER}.${order.poNumber}`,
      sort: `-${ORDER_FILTERS.PO_NUMBER}`,
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
      order,
      line,
      materialTypes,
      locations,
      vendors,
      editable,
      deleteLine,
      tagsToggle,
    } = this.props;
    const tags = get(line, ['tags', 'tagList'], []);

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
        <TagsBadge
          tagsToggle={tagsToggle}
          tagsQuantity={tags.length}
        />
      </PaneMenu>
    );

    if (!(get(line, 'id') && get(order, 'id'))) {
      return (
        <Pane id="pane-poLineDetails" defaultWidth="fill" paneTitle="PO Line Details" onClose={onClose} dismissible>
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
    const estimatedPrice = get(line, ['cost', 'poLineEstimatedPrice'], 0);
    const fundDistributions = get(line, 'fundDistribution', []);
    const currency = get(line, 'cost.currency');
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
            <IfPermission perm="ui-orders.receiving">
              {(isReceiveButtonVisible || isCheckInButtonVisible) && (
                <div>
                  <Button
                    buttonStyle="primary"
                    data-test-line-receive-button
                    to={`/receiving?qindex=poLine.poLineNumber&query=${poLineNumber}`}
                  >
                    <FormattedMessage id="ui-orders.paneBlock.receiveBtn" />
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
                vendors={vendors}
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
