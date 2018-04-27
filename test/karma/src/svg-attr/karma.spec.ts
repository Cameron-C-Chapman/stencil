import { setupDomTests } from '../util';

describe('svg attr', () => {
  const { setupDom, tearDownDom, flush } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/svg-attr/index.html');
  });
  afterEach(tearDownDom);

  it('adds and removes attribute', async () => {
    const rect = app.querySelector('rect');
    expect(rect.getAttribute('transform')).toBe(null);

    const button = app.querySelector('button');
    button.click();
    await flush(app);
    expect(rect.getAttribute('transform')).toBe('rotate(45 27 27)');

    button.click();
    await flush(app);
    expect(rect.getAttribute('transform')).toBe(null);
  });

});
