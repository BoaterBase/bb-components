import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'bb-listing',
  styleUrl: 'bb-listing.css',
  shadow: true
})
export class BbListing {

  // @Prop() listingPath: string;

  // @State() listingSnaphot: firestore.DocumentSnapshot;

  // get profileId() {
  //   // Allow for pretty urls where the id is at the end
  //   return this.profilePath.split('-', 1).pop();
  // }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
