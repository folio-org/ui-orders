import {
  clickable,
  collection,
  interactor,
  isPresent,
  text,
} from '@bigtest/interactor';

import Button from './button';
import { TIMEOUT } from './const';

@interactor class BillTo {
  static defaultScope = '[data-test-order-details-bill-to]';
  value = text('[class*=kvRoot---]');
}

@interactor class ShipTo {
  static defaultScope = '[data-test-order-details-ship-to]';
  value = text('[class*=kvRoot---]');
}

@interactor class WorkflowStatus {
  static defaultScope = '[data-test-workflow-status]';
  value = text('[class*=kvValue---]');
}

@interactor class Header {
  static defaultScope = '[data-test-order-details] [class*=paneTitleLabel---]';
  title = text();
}

@interactor class OrderDetailsActions {
  static defaultScope = '#order-details-actions';
  delete = new Button('[data-test-button-delete-order]');
  edit = new Button('[data-test-button-edit-order]');
  clone = new Button('[data-test-clone-order-button]');
}

@interactor class RelatedInvoicesAccordion {
  static defaultScope = '#relatedInvoices';

  invoices = collection('[class*=mclRow---]', {
    link: clickable('[data-test-link-to-invoice]'),
  });
}

export default interactor(class OrderDetailsPage {
  static defaultScope = '[data-test-order-details]';
  actionsMenu = new OrderDetailsActions();
  header = new Header();
  closeReasonBlock = isPresent('[data-test-close-reason-block]');
  addLineButton = new Button('[data-test-add-line-button]');
  receivingButton = new Button('[data-test-receiving-button]');
  openOrderButton = new Button('[data-test-open-order-button]');
  approveOrderButton = new Button('[data-test-approve-order-button]');
  closeOrderButton = new Button('[data-test-close-order-button]');
  reopenOrderButton = new Button('[data-test-reopen-order-button]');
  renewalsAccordion = isPresent('#ongoing');
  billTo = new BillTo();
  shipTo = new ShipTo();
  workflowStatus = new WorkflowStatus();
  lines = collection('#POListing [class*=mclRow---]');
  isLoaded = isPresent('#POListing');
  relatedInvoicesAccordion = new RelatedInvoicesAccordion();
  orderInvoicesIsPresent = isPresent('#orderInvoices');
  totalEncumbered = isPresent('[data-test-total-encumbered]');

  whenLoaded() {
    return this.timeout(20000).when(() => this.isLoaded);
  }

  whenInvoicesLoaded() {
    return this.timeout(TIMEOUT).when(() => this.orderInvoicesIsPresent);
  }
});
