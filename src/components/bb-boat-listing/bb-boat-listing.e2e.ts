import { newE2EPage } from '@stencil/core/testing';

describe('bb-boat-listing', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<bb-boat-listing></bb-boat-listing>');

    const element = await page.find('bb-boat-listing');
    expect(element).toHaveClass('hydrated');
  });
});
