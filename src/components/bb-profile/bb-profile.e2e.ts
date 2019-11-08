import { newE2EPage } from '@stencil/core/testing';

describe('bb-profile', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<bb-profile></bb-profile>');

    const element = await page.find('bb-profile');
    expect(element).toHaveClass('hydrated');
  });
});
