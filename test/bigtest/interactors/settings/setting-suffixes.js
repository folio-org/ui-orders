import {
  interactor,
  collection,
} from '@bigtest/interactor';

import {
  ButtonInteractor,
  TextFieldInteractor,
} from '@folio/stripes-acq-components/test/bigtest/interactors';

@interactor class Suffixes {
  list = collection('[class*=editListRow---]', {
    nameInput: new TextFieldInteractor('input[type="text"]'),
    saveButton: new ButtonInteractor('#clickable-save-suffixes-0'),
    cancelButton: new ButtonInteractor('#clickable-cancel-suffixes-0'),
    editButton: new ButtonInteractor('#clickable-edit-suffixes-0'),
    deleteButton: new ButtonInteractor('#clickable-delete-suffixes-0'),
  });
}

export default interactor(class SuffixesInteractor {
  static defaultScope = '#suffixes';

  suffixes = new Suffixes('#editList-suffixes');
  addSuffixBtn = new ButtonInteractor('#clickable-add-suffixes');
});
