import { newE2EPage } from '@stencil/core/testing';

describe('bb-listing', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<bb-listing></bb-listing>');

    const element = await page.find('bb-listing');
    expect(element).toHaveClass('hydrated');
  });
});
