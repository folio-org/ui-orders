import {
  collection,
  interactor,
  isPresent,
} from '@bigtest/interactor';

export default interactor(class OrderTemplatesList {
  static defaultScope = '#order-settings-order-templates-list';

  isLoaded = isPresent('#paneHeaderorder-settings-order-templates-list-pane-title');
  list = collection('[class*=NavListItem---]');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
