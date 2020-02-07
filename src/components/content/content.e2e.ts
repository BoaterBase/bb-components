import { newE2EPage } from '@stencil/core/testing';

describe('bb-content', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<bb-content></bb-content>');

    const element = await page.find('bb-content');
    expect(element).toHaveClass('hydrated');
  });
});
