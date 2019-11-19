import {
  interactor,
  isPresent,
} from '@bigtest/interactor';

import Button from './button';
import { TIMEOUT } from './const';

export default interactor(class NoteViewPage {
  static defaultScope = '[class*=paneset---]';

  closeButton = new Button('[data-test-leave-note-form]');
  editButton = new Button('[data-test-navigate-note-edit]');

  isLoaded = isPresent('[class*=paneHeader---]');

  whenLoaded() {
    return this.timeout(TIMEOUT).when(() => this.isLoaded);
  }
});
