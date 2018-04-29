import { TspPage } from './app.po';

describe('tsp App', function() {
  let page: TspPage;

  beforeEach(() => {
    page = new TspPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Hello delivery driver!');
  });
});
