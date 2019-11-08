import { newE2EPage } from '@stencil/core/testing';

describe('bb-contact-form', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<bb-contact-form></bb-contact-form>');

    const element = await page.find('bb-contact-form');
    expect(element).toHaveClass('hydrated');
  });
});
