import { Component, Host, Prop, State, Event, EventEmitter, h } from '@stencil/core';
import { cdnAsset, formatCurrency, cleanText } from '../../utils/utils';
import { converter } from '../../utils/converter';

import slugify from 'slugify';

@Component({
  tag: 'bb-listing-card',
  styleUrl: 'bb-listing-card.css',
  shadow: true
})
export class BbListingCard {
  @Prop() root: string = '/';
  @Prop() listingId: string;
  @Prop() listingData: any;
  @Prop() display: 'card' | 'list' | 'overlay' = 'overlay';


  @State() selectedMedia = 0;

  @Event({
    eventName: 'linkClick',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) linkClick: EventEmitter;

  // TODO - see collection handler with (path) for other links
  linkClickHandler = (ev) => {
    let event = this.linkClick.emit({
      path: `listings/${slugify(this.listingData.title)}-${this.listingId}`
    });

    if (event.defaultPrevented) {
      ev.preventDefault();
    }
  }

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
          <a onClick={this.linkClickHandler} class="card link scale-hover" style={{ flex: 'auto', display: 'block', textDecoration: 'none' }} href={`${this.root}listings/${slugify(this.listingData.title)}-${this.listingId}`}>
            <div class="preview-image" style={{ position: 'relative' }}>
              <svg viewBox="0 0 6 4" style={{ display: 'block', width: '100%' }}></svg>
              {primaryMedia && <img style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', objectFit: 'cover' }} src={cdnAsset(primaryMedia.info, 'jpg', 't_large_image')} />}
              {listing.profile?.data?.avatar?.info && <img src={listing.profile.data.avatar.info.thumbnail_url} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', width: '3rem', height: '3rem', border: '1px solid white', borderRadius: '100%' }} />}
            </div>
            <div style={{ display: 'flex', background: '#f1f1f1', padding: '1rem 0.75rem 0.5rem 0.75rem' }}>
              <h2 style={{ flex: 'auto', color: '#445566', margin: '0', fontWeight: '400', fontSize: '1.65rem' }}>
                {this.listingData.title}
              </h2>
              {this.listingData.messageDisplay == 'highlight' && this.listingData.message && <div style={{ background: 'rgba(255,50,0,0.8)', color: 'white', fontSize: '0.75rem', borderRadius: '0.25rem', fontWeight: '500', padding: '0.5rem', textTransform: 'uppercase' }}>{cleanText(this.listingData.message)}</div>}
              {this.listingData.messageDisplay == 'visible' && this.listingData.message && <div style={{ background: 'rgba(50,50,50,0.8)', color: 'white', fontSize: '0.75rem', borderRadius: '0.25rem', fontWeight: '500', padding: '0.5rem', textTransform: 'uppercase' }}>{cleanText(this.listingData.message)}</div>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', background: '#f1f1f1', padding: '0.75rem' }}>

              <div style={{ flex: 'auto' }}>
                <div class="title" style={{ fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
                  <ion-icon name="information-circle" style={{ marginRight: '3px', opacity: '0.5' }}></ion-icon>
                  {shortTitle.join(' · ')}</div>
                {(listing.location || listing.profile?.data?.name) && <div style={{ display: 'flex', alignItems: 'center', color: 'inherit', opacity: '0.5', fontWeight: '400', fontSize: '0.9rem' }}>
                  <ion-icon name="compass" style={{ marginRight: '3px', opacity: '0.5' }}></ion-icon>
                  {[listing.profile?.data?.name, listing.location].filter(Boolean).join(', ')}
                </div>}
              </div>
              <div style={{ flex: 'auto', textAlign: 'right' }}>
                {listing.label && <div style={{ fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', opacity: '0.5' }}>{cleanText(listing.label)}</div>}
                <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>{listing.price && formatCurrency(listing.price, listing.currency)}</div>
              </div>
            </div>
          </a>
        </Host>
      );

    if (this.display == 'overlay')
      return (
        <Host class="overlay-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
          <a onClick={this.linkClickHandler} class="link" style={{ flex: 'auto', display: 'block', textDecoration: 'none' }} href={`${this.root}listings/${slugify(this.listingData.title)}-${this.listingId}`}>
            <div class="preview-image" style={{ position: 'relative' }}>
              <svg viewBox="0 0 6 4" style={{ display: 'block', width: '100%' }}></svg>
              {primaryMedia && <img style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', objectFit: 'cover' }} src={cdnAsset(primaryMedia.info, 'jpg', 't_large_image')} />}
              {this.listingData.message && <div class="message">{cleanText(this.listingData.message)}</div>}
              <div class="overlay-header">
                <div style={{ display: 'flex', margin: '0.5rem', alignItems: 'flex-end' }}>
                  <div style={{ flex: 'auto' }}>
                    <div class="title" style={{ fontWeight: '600' }}>{shortTitle.join(' · ')}</div>
                    {this.listingData.location && <div style={{ color: 'inherit', opacity: '0.5', fontWeight: '400' }}>
                      <ion-icon name="pin"></ion-icon>
                      {this.listingData.location}
                    </div>}
                  </div>
                  <div style={{ flex: 'auto', textAlign: 'right', alignItems: 'flex-end' }}>
                    {listing.label && <div style={{ fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', opacity: '0.5' }}>{listing.label}</div>}
                    <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>{listing.price && formatCurrency(listing.price, listing.currency)}</div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </Host>
      );
  }

}
