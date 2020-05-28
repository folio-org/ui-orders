import {
  collection,
  interactor,
  isPresent,
} from '@bigtest/interactor';

import {
  ButtonInteractor,
} from '@folio/stripes-acq-components/test/bigtest/interactors';

import { TIMEOUT } from './const';

export default interactor(class DeletePiecesModal {
  static defaultScope = '#data-test-delete-pieces-modal';
  deleteBtn = new ButtonInteractor('[data-test-delete-pieces-delete]');
  piecesCheckboxes = collection('[data-test-delete-piece-checked]');
  whenLoaded() {
    return this.timeout(TIMEOUT).when(() => isPresent('#delete-pieces-list'));
  }
});
