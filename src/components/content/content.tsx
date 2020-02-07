import { Component, Host, h, Prop } from '@stencil/core';
import { markdown } from '../../utils/utils';

@Component({
  tag: 'bb-content',
  styleUrl: 'content.css',
  shadow: false
})
export class Content {
  @Prop() content = [];

  render() {
    return (
      <Host>
        {this.content.map((c) => <div class="content">
          {c.kind == 'heading' && <h2>{c.text}</h2>}
          {c.kind == 'text' && <div class="markdown">{markdown(c.text)}</div>}
          {c.kind == 'media' && <bb-media items={c.items} display={c.display}></bb-media>}
        </div>)}
      </Host>
    );
  }

}
