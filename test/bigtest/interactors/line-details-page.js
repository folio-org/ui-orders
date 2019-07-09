import {
  interactor,
  isPresent,
} from '@bigtest/interactor';

import Button from './button';

@interactor class LineDetailsPageActions {
  static defaultScope = '#data-test-line-details-actions';

  toggle = new Button('[class*=paneHeaderCenterButton---]');
  viewPOButton = new Button('[data-test-line-details-actions-view-po]');
  delete = new Button('[data-test-button-delete-line]');
  edit = new Button('[data-test-button-edit-line]');
}

export default interactor(class LineDetailsPage {
  static defaultScope = '#pane-poLineDetails';
  receiveButton = new Button('[data-test-line-receive-button]');
  checkInButton = new Button('[data-test-line-check-in-button]');
  otherDetailsAccordion = isPresent('#other');
  goBackToOrderButton = new Button('#clickable-backToPO');
  isLoaded = isPresent('[class*=paneTitleLabel---]');

  actions = new LineDetailsPageActions();
  whenLoaded() {
    return this.timeout(7000).when(() => this.isLoaded);
  }
});
