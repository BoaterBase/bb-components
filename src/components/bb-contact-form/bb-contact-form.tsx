import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'bb-contact-form',
  styleUrl: 'bb-contact-form.css',
  shadow: true
})
export class BbContactForm {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
