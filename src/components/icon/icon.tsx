import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'bb-icon',
  shadow: true
})
export class Icon {
  @Prop() icon: string;
  @Prop() color: string;
  @Prop() size: string = '1em';

  render() {
    let url = `https://api.iconify.design/${this.icon}.svg?color=${encodeURIComponent(this.color)}`;

    return (
      <Host>
        <i style={{ display: 'inline-block', width: this.size, height: this.size, background: `url('${url}') no-repeat center center / contain` }} />
      </Host>
    );
  }
}
