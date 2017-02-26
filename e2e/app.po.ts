import { browser, element, by } from 'protractor';

export class TspPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('tsp-root h1')).getText();
  }
}
