import { newE2EPage } from '@stencil/core/testing';

describe('bb-collection', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<bb-collection></bb-collection>');

    const element = await page.find('bb-collection');
    expect(element).toHaveClass('hydrated');
  });
});
