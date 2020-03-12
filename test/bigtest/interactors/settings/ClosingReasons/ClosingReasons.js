import {
  interactor,
  collection,
  isPresent,
} from '@bigtest/interactor';

import {
  ButtonInteractor,
  TextFieldInteractor,
} from '@folio/stripes-acq-components/test/bigtest/interactors';

import { TIMEOUT } from '../../const';

@interactor class ClosingReasons {
  list = collection('[class*=editListRow---]', {
    nameInput: new TextFieldInteractor('input[type="text"]'),
    saveButton: new ButtonInteractor('#clickable-save-closingReasons-0'),
    cancelButton: new ButtonInteractor('#clickable-cancel-closingReasons-0'),
    editButton: new ButtonInteractor('#clickable-edit-closingReasons-0'),
    deleteButton: new ButtonInteractor('#clickable-delete-closingReasons-0'),
  });
}

export default interactor(class ClosingReasonsInteractor {
  static defaultScope = '#closingReasons';

  closingReasons = new ClosingReasons('#editList-closingReasons');
  addReasonBtn = new ButtonInteractor('#clickable-add-closingReasons');

  isLoaded = isPresent('[class*=editableListFormHeader]');
  whenLoaded() {
    return this.timeout(TIMEOUT).when(() => this.isLoaded);
  }
});
