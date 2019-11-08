import { Component, Host, Prop, State, h } from '@stencil/core';
import { Link } from '../../functional/Link';
import { cdnAsset } from '../../utils/utils';
import slugify from 'slugify';

@Component({
  tag: 'bb-listing-card',
  styleUrl: 'bb-listing-card.css',
  shadow: true
})
export class BbListingCard {
  @Prop() history: any;
  @Prop() listingId: string;
  @Prop() listingData: any;

  @State() selectedMedia = 0;
  render() {
    if (!this.listingData)
      return (<Host>
        Loading
      </Host>)


    const primaryMedia = this.listingData.media[this.selectedMedia];

    return (
      <Host style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <Link class="link" style={{ flex: 'auto', display: 'block', textDecoration: 'none' }} href={`/listings/${slugify(this.listingData.title)}-${this.listingId}`} history={this.history}>
          <div class="preview-image" style={{ position: 'relative' }}>
            <svg viewBox="0 0 6 4" style={{ display: 'block', width: '100%' }}></svg>
            {primaryMedia && <img style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', objectFit: 'cover' }} src={cdnAsset(primaryMedia.info, 'jpg', 't_large_image')} />}
            {this.listingData.message && <div style={{ position: 'absolute', top: '1rem', left: '0', background: 'rgba(255,50,0,0.8)', color: 'white', fontSize: '0.85rem', fontWeight: '600', padding: '0.25rem 0.5rem', borderRadius: '0 3px 3px 0' }}>{this.listingData.message}</div>}
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <div class="title" style={{ fontWeight: '600' }}>{this.listingData.title}</div>
            <div style={{ color: 'inherit', opacity: '0.5', fontWeight: '400' }}>{this.listingData.location}</div>
          </div>
        </Link>
      </Host>
    );

  }

}
