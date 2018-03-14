import { FallWebPage } from './app.po';

describe('fall-web App', () => {
  let page: FallWebPage;

  beforeEach(() => {
    page = new FallWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
