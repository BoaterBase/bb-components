import { Component, Host, h, Prop } from '@stencil/core';
import { cdnAsset } from '../../utils/utils';

@Component({
  tag: 'bb-media',
  styleUrl: 'media.css',
  shadow: true
})
export class Media {
  @Prop() display = 'grid';
  @Prop() items = [];

  render() {
    if (this.display)
      return (
        <Host>
          <div class="display-grid">
            {this.items.map((item) => (<a key={item.key} class="display-grid-item" href={item.info.secure_url}>
              <svg viewBox="0 0 4 3" style={{ display: 'block', width: '100%', background: 'lightblue', borderRadius: 'var(--bb-border-radius)' }}></svg>
              {item.info.resource_type == 'image' && <img class="display-grid-image" src={cdnAsset(item.info, 'jpg', 't_small_image')} />}
            </a>))}
          </div>
        </Host>
      );
  }

}
