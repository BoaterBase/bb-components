import { Component, Host, Prop, State, h } from '@stencil/core';
import { Link } from '../../functional/Link';
import { cdnAsset, formatCurrency } from '../../utils/utils';
import { converter } from '../../utils/converter';

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
  @Prop() display: 'card' | 'list' | 'overlay' = 'overlay';

  @State() selectedMedia = 0;
  render() {
    if (!this.listingData)
      return (<Host>
        Loading
      </Host>)

    const listing = this.listingData;
    const specs = listing.specifications || {};

    const primaryMedia = listing.media[this.selectedMedia];
    const shortTitle = ([specs.loa && Math.round(converter('length', 'm', 'ft', specs.loa)) + "'", specs.year, specs.manufacturer, specs.manufacturer && specs.model, specs.category, specs.classification]).filter(Boolean).slice(0, 3);

    if (this.display == 'card')
      return (
        <Host style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
          <Link class="link" style={{ flex: 'auto', display: 'block', textDecoration: 'none' }} href={`/listings/${slugify(this.listingData.title)}-${this.listingId}`} history={this.history}>
            <div class="preview-image" style={{ position: 'relative' }}>
              <svg viewBox="0 0 6 4" style={{ display: 'block', width: '100%' }}></svg>
              {primaryMedia && <img style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', objectFit: 'cover' }} src={cdnAsset(primaryMedia.info, 'jpg', 't_large_image')} />}
              {this.listingData.message && <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', background: 'rgba(255,50,0,0.8)', color: 'white', fontSize: '0.85rem', fontWeight: '600', padding: '0.5rem', borderRadius: '3px' }}>{this.listingData.message}</div>}
            </div>
            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'flex-end' }}>
              <div style={{ width: '50%' }}>
                <div class="title" style={{ fontWeight: '600' }}>{shortTitle.join(' · ')}</div>
                {this.listingData.location && <div style={{ color: 'inherit', opacity: '0.5', fontWeight: '400' }}>
                  <ion-icon name="pin"></ion-icon>
                  {this.listingData.location}
                </div>}
              </div>
              <div style={{ width: '50%', textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', opacity: '0.5' }}>{listing.label}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>{listing.price && formatCurrency(listing.price, listing.currency)}</div>
              </div>
            </div>
          </Link>
        </Host>
      );

    if (this.display == 'overlay')
      return (
        <Host class="overlay-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
          <Link class="link" style={{ flex: 'auto', display: 'block', textDecoration: 'none' }} href={`/listings/${slugify(this.listingData.title)}-${this.listingId}`} history={this.history}>
            <div class="preview-image" style={{ position: 'relative' }}>
              <svg viewBox="0 0 6 4" style={{ display: 'block', width: '100%' }}></svg>
              {primaryMedia && <img style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', objectFit: 'cover' }} src={cdnAsset(primaryMedia.info, 'jpg', 't_large_image')} />}
              {this.listingData.message && <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', background: 'rgba(220,50,0,0.85)', color: 'white', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: '500', padding: '0.5rem', borderRadius: '3px' }}>{this.listingData.message}</div>}
              <div class="overlay-header" style={{ position: 'absolute', paddingTop: '1rem', bottom: '0', left: '0', width: '100%', color: '#fff' }}>
                <div style={{ display: 'flex', margin: '0.5rem', alignItems: 'flex-end' }}>
                  <div style={{ flex: 'auto' }}>
                    <div class="title" style={{ fontWeight: '600' }}>{shortTitle.join(' · ')}</div>
                    {this.listingData.location && <div style={{ color: 'inherit', opacity: '0.5', fontWeight: '400' }}>
                      <ion-icon name="pin"></ion-icon>
                      {this.listingData.location}
                    </div>}
                  </div>
                  <div style={{ flex: 'auto', textAlign: 'right', alignItems: 'flex-end' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', opacity: '0.5' }}>{listing.label}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>{listing.price && formatCurrency(listing.price, listing.currency)}</div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </Host>
      );
  }

}
