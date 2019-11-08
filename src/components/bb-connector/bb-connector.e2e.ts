import { newE2EPage } from '@stencil/core/testing';

describe('bb-connector', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<bb-connector></bb-connector>');

    const element = await page.find('bb-connector');
    expect(element).toHaveClass('hydrated');
  });
});
