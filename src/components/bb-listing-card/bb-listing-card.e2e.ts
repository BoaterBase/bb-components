import { newE2EPage } from '@stencil/core/testing';

describe('bb-listing-card', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<bb-listing-card></bb-listing-card>');

    const element = await page.find('bb-listing-card');
    expect(element).toHaveClass('hydrated');
  });
});
