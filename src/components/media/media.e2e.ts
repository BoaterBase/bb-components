import { newE2EPage } from '@stencil/core/testing';

describe('bb-media', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<bb-media></bb-media>');

    const element = await page.find('bb-media');
    expect(element).toHaveClass('hydrated');
  });
});
