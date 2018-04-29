import { TspPage } from './app.po';

describe('tsp App', function() {
  let page: TspPage;

  beforeEach(() => {
    page = new TspPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Hello delivery driver! 🚚');
  });
});
