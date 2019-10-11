import {
  interactor,
} from '@bigtest/interactor';
import MultiSelectionInteractor from '@folio/stripes-acq-components/test/bigtest/interactors';

export default interactor(class SettingSuffixesInteractor {
  static defaultScope = '[data-test-order-settings-suffixes]';
  suffixSelect = new MultiSelectionInteractor('[data-test-suffixes-list]');
});
