import {
  clickable,
  collection,
  interactor,
  isPresent,
} from '@bigtest/interactor';

import Button from './button';
import { TIMEOUT } from './const';

@interactor class LineDetailsPageActions {
  static defaultScope = '#data-test-line-details-actions';

  toggle = new Button('[class*=paneHeaderCenterButton---]');
  viewPOButton = new Button('[data-test-line-details-actions-view-po]');
  delete = new Button('[data-test-button-delete-line]');
  edit = new Button('[data-test-button-edit-line]');
}

@interactor class RelatedInvoicesAccordion {
  static defaultScope = '#relatedInvoices';

  invoices = collection('[class*=mclRow---]', {
    link: clickable('[data-test-link-to-invoice]'),
  });
}

@interactor class NotesAccordion {
  static defaultScope = '#notes';

  newNoteButton = new Button('[data-test-notes-accordion-new-button]');
  notes = collection('#notes-list [class^="mclRow-"]', {
    click: clickable(),
  });
}

export default interactor(class LineDetailsPage {
  static defaultScope = '#pane-poLineDetails';
  receiveButton = new Button('[data-test-line-receive-button]');
  checkInButton = new Button('[data-test-line-check-in-button]');
  otherDetailsAccordion = isPresent('#other');
  goBackToOrderButton = new Button('#clickable-backToPO');
  isLoaded = isPresent('#ItemDetails');
  relatedInvoicesAccordion = new RelatedInvoicesAccordion();
  notesAccordion = new NotesAccordion();
  lineInvoicesIsPresent = isPresent('#lineInvoices');

  actions = new LineDetailsPageActions();
  whenLoaded() {
    return this.timeout(TIMEOUT).when(() => this.isLoaded);
  }

  whenInvoicesLoaded() {
    return this.timeout(TIMEOUT).when(() => this.lineInvoicesIsPresent);
  }
});
