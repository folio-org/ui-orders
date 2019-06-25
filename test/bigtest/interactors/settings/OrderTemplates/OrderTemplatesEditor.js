import {
  interactor,
  isPresent,
  text,
} from '@bigtest/interactor';

export default interactor(class OrderTemplatesList {
  static defaultScope = '#order-template-form';

  isLoaded = isPresent('#order-settings-order-templates-editor');
  title = text('[class*=paneTitleLabel---]');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
