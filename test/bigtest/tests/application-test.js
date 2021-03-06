import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ApplicationInteractor from '../interactors/application';

describe('Application', function () {
  setupApplication();
  const app = new ApplicationInteractor();

  beforeEach(function () {
    this.visit('/');
  });

  it('renders', () => {
    expect(app.isPresent).to.be.true;
  });
});
