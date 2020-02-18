import {
  interactor,
  isPresent,
} from '@bigtest/interactor';

import Button from './button';
import { TIMEOUT } from './const';

export default interactor(class NoteViewPage {
  static defaultScope = '[data-test-note-view-container]';

  closeButton = new Button('[data-test-leave-note-form]');
  editButton = new Button('[data-test-navigate-note-edit]');

  isLoaded = isPresent('#noteGeneralInfo');

  whenLoaded() {
    return this.timeout(TIMEOUT).when(() => this.isLoaded);
  }
});
