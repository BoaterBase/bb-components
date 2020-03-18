import { Component, h, Host, Prop, State, Watch, Element } from '@stencil/core';
import { converter } from '../../utils/converter';
import { cdnAsset, buildMetaData, formatCurrency, formatNumber } from '../../utils/utils';
import { Head } from 'stencil-head';

//let BB_API = 'http://localhost:5000/api'
let BB_API = 'https://www.boaterbase.com/api';


@Component({
  tag: 'bb-listing',
  styleUrl: 'bb-listing.css',
  shadow: true
})
export class BbListing {
  @Element() el: HTMLElement;

  @Prop() listingPath: string;
  @Prop() root: string = '/';

  @State() listingResponse: any;
  @State() updatesResponse: any;

  @State() overlay: { kind: '' | 'spinner' | 'contact' | 'media', selected?: number } = {
    kind: '',
    selected: 0,
  };

  @State() message = {
    name: '',
    email: '',
    telephone: '',
    content: ''
  };

  @State() watch = {
    email: ''
  };

  @State() showContent = false;


  get listingId() {
    // Allow for pretty urls where the id is at the end
    return this.listingPath.split('-').pop();
  }

  fetchData() {
    return fetch(`${BB_API}/listings/${this.listingId}`, {
      headers: {
        'Accept': 'application/json',
      },
      method: 'GET'
    }).then();
  }

  fetchUpdates() {
    return fetch(`${BB_API}/listings/${this.listingId}/updates`, {
      headers: {
        'Accept': 'application/json',
      },
      method: 'GET'
    }).then(response => response.json());
  }

  async componentWillLoad() {
    this.listingResponse = await this.fetchData().then(response => response.json());
    // Change meta data
    //document.title = this.listingResponse.title ? this.listingResponse.title : 'Listing Not Found';
  }

  async componentDidLoad() {
    this.updatesResponse = await this.fetchUpdates();
    this.el.scrollIntoView && this.el.scrollIntoView();
  }

  @Watch('listingPath')
  async watchPath(newValue: string, oldValue: string) {
    console.log('Path Changed', newValue, oldValue)
    this.listingResponse = await this.fetchData().then(response => response.json());
    this.updatesResponse = await this.fetchUpdates();
  }

  sendMessage = async (ev: Event) => {
    ev.preventDefault();

    this.overlay = {
      kind: 'spinner',
      selected: 0
    };

    let response = await fetch(`${BB_API}/listings/${this.listingId}/messages`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(this.message)
    });

    if (response.status != 200) {
      this.overlay = {
        kind: 'contact',
        selected: 0
      };
      alert('There was an error, please try again!');

      console.log(response);
    } else {
      this.overlay = {
        kind: '',
        selected: 0
      };
    }
  }

  watchListing = async (ev: Event) => {
    ev.preventDefault();

    try {
      let response = await fetch(`${BB_API}/listings/${this.listingId}/subscribers`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(this.watch)
      });

      if (response.status != 200) {

        alert('There was an error, please try again!');
        console.log(response);
      } else {
        alert('Subscribed to updates!')
        this.watch = {
          email: ''
        }
      }
    } catch (err) {
      alert('There was an error, please try again!');
      console.log(err);
    }
  }

  render() {
    //console.log(this.listingResponse)

    if (!this.listingResponse)
      return <Host>Missing</Host>


    const listing = this.listingResponse;

    const specs = listing.specifications || {};
    const media = listing.media || [];
    const content = listing.content || [];

    const primaryMedia = listing.media[0];

    const selectedMedia = this.overlay && listing.media[this.overlay.selected];

    //const primaryVariant = listing.variants && listing.variants[0];

    //const shortTitle = ([specs.loa && Math.round(converter('length', 'm', 'ft', specs.loa)) + "'", specs.year, specs.manufacturer, specs.manufacturer && specs.model, specs.category, specs.classification]).filter(Boolean).slice(0, 3);


    let mediaLength = (listing.media || []).length;
    let mediaStack = (listing.media || []).slice(0, 12);

    const meta = buildMetaData(listing.title, listing.summary, 'article', primaryMedia?.info?.secure_url && cdnAsset(primaryMedia.info, 'jpg', 't_large_image'));

    return (<Host>
      <div style={{ display: 'none' }}><Head data={meta}></Head></div>

      <div class="hover-zoom" style={{ margin: '1rem', position: 'relative', borderRadius: 'var(--bb-border-radius)' }} >
        <svg viewBox="0 0 16 9" style={{ display: 'block', width: '100%', background: 'lightblue', borderRadius: 'var(--bb-border-radius)' }}></svg>
        {primaryMedia && <div onClick={() => this.overlay = { kind: 'media', selected: 0 }} style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' }}>
          {primaryMedia.info.resource_type == 'image' && <img style={{ borderRadius: 'var(--bb-border-radius)', display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} src={cdnAsset(primaryMedia.info, 'jpg', 't_large_image')} />}
          {primaryMedia.info.resource_type == 'video' && <video style={{ borderRadius: 'var(--bb-border-radius)', display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} autoplay muted playsInline poster={cdnAsset(primaryMedia.info, 'jpg', 't_large_image')}>
            <source src={cdnAsset(primaryMedia.info, 'm3u8', 't_streaming_video')} type="application/x-mpegURL" />
            <source src={cdnAsset(primaryMedia.info, 'mp4', 't_progressive_video')} type="video/mp4" />
            {/*                    
                    <source src={cdnAsset(m.info, 'mpd', 't_streaming_video')} type="application/dash+xml" />
                    <source src={cdnAsset(m.info, 'webm', 't_progressive_video')} type="video/webm" />
                    <source src={cdnAsset(m.info, 'ogv', 't_progressive_video')} type="video/ogg" />
                    */}
          </video>}
        </div>}
        {listing.message && <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', background: 'rgba(255,50,0,0.8)', color: 'white', fontSize: '0.85rem', fontWeight: '600', padding: '0.5rem', borderRadius: '3px' }}>{listing.message}</div>}
        <div style={{ position: 'absolute', paddingTop: '1rem', bottom: '0', left: '0', width: '100%', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', margin: '0.5rem' }}>
            <div style={{ flex: 'auto' }}>
              {listing.location && <div style={{ color: 'inherit', opacity: '0.5', fontWeight: '400' }}><bb-icon icon="gridicons:location" color="#ffffff"></bb-icon> {listing.location}</div>}
            </div>
            <div style={{ flex: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', opacity: '0.5' }}>{listing.label}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '700' }}>{listing.price && formatCurrency(listing.price, listing.currency)}</div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div style={{ margin: '1rem', display: 'flex', flexWrap: 'wrap' }}>
          <div style={{ flex: '5 1 600px', paddingRight: '1rem', paddingBottom: '1rem' }}>
            <h1 class="title">{listing.title}</h1>
            <p class="summary">{listing.summary}</p>
          </div>
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #f1f1f1', borderRadius: '0.25rem', paddingTop: '0.5rem' }}>
            <img src={listing.profile?.data?.avatar?.info ? listing.profile.data.avatar.info.thumbnail_url : `https://gravatar.com/avatar/b6de1b5951e1ab139a39968f907c4f77?d=mp`} style={{ display: 'inline-block', border: '1px solid #eeeeee', borderRadius: '100%', width: '4rem', height: '4rem' }} />

            <span style={{ fontSize: '1rem', opacity: '0.8', fontWeight: 'bold' }}>{listing.profile && listing.profile.data && listing.profile.data.name ? ` ${listing.profile.data.name}` : 'Owner'}</span>
            <div style={{ fontSize: '1.5rem' }}>
              {listing.profile?.data?.twitter && <a style={{ color: '#ccc' }} href={`https://twitter.com/${listing.profile.data.twitter}`}><bb-icon icon="brandico:twitter-bird"></bb-icon></a>}
              {listing.profile?.data?.facebook && <a style={{ color: '#ccc' }} href={`https://facebook.com/${listing.profile.data.facebook}`}><bb-icon icon="brandico:facebook"></bb-icon></a>}
              {listing.profile?.data?.website && <a style={{ color: '#ccc' }} href={`${listing.profile.data.website}`}><bb-icon icon="entypo:link"></bb-icon></a>}
            </div>

            <div style={{ display: 'flex', padding: '0.25rem' }}>
              <button class="contact-button" onClick={() => this.overlay = { kind: 'contact' }}>Message</button>
              {listing.profile?.data?.email && <a class="contact-button" href={`javascript:window.location.href='mailto:'+atob('${btoa(listing.profile?.data?.email)}')`}>Email</a>}
              {listing.profile?.data?.telephone && <a class="contact-button" href={`javascript:window.location.href='tel:'+atob('${btoa(listing.profile?.data?.telephone)}')`}>Call</a>}
            </div>
          </div>
        </div>

        <ul class="specs">
          {specs.category && <li><h3>Category</h3><span>{specs.category}</span></li>}
          {specs.classification && <li><h3>Classification</h3><span>{specs.classification}</span></li>}

          {specs.manufacturer && <li><h3>Manufacturer</h3><span>{specs.manufacturer}</span></li>}
          {specs.model && <li><h3>Model</h3><span>{specs.model}</span></li>}

          {specs.designer && <li><h3>Designer</h3><span>{specs.designer}</span></li>}
          {specs.builder && <li><h3>Builder</h3><span>{specs.builder}</span></li>}

          {specs.loa ? <li><h3>Length Overall</h3><span>{formatNumber(converter('length', 'm', 'ft', specs.loa))} <small>ft</small></span></li> : null}
          {specs.lwl ? <li><h3>Length At Waterline</h3><span>{formatNumber(converter('length', 'm', 'ft', specs.lwl))} <small>ft</small></span></li> : null}

          {specs.beam ? <li><h3>Beam</h3><span>{formatNumber(converter('length', 'm', 'ft', specs.beam))} <small>ft</small></span></li> : null}
          {specs.draft ? <li><h3>Draft</h3><span>{formatNumber(converter('length', 'm', 'ft', specs.draft))} <small>ft</small></span></li> : null}

          {specs.haw ? <li><h3>Height Above Waterline</h3><span>{formatNumber(converter('length', 'm', 'ft', specs.haw))} <small>ft</small></span></li> : null}

          {specs.profile && <li><h3>Profile</h3><span>{specs.profile}</span></li>}
          {specs.material && <li><h3>Material</h3><span>{specs.material}</span></li>}


          {specs.displacement ? <li><h3>Displacement</h3><span>{formatNumber(converter('mass', 'kg', 'lb', specs.displacement))} <small>lb</small></span></li> : null}
          {specs.weight ? <li><h3>Dry Weight</h3><span>{formatNumber(converter('mass', 'kg', 'lb', specs.weight))} <small>lb</small></span></li> : null}


          {specs.propulsion && <li><h3>Propulsion</h3><span>{specs.propulsion}</span></li>}
          {specs.engines ? <li><h3>Engines</h3><span>{specs.engines}</span></li> : null}

          {specs.power ? <li><h3>Engine Power</h3><span>{formatNumber(converter('power', 'kw', 'hp', specs.power))} <small>hp</small></span></li> : null}

          {specs.fuelcapacity ? <li><h3>Fuel Capacity</h3><span>{formatNumber(converter('volume', 'l', 'gal', specs.fuelcapacity))} <small>gal</small></span></li> : null}
          {specs.watercapacity ? <li><h3>Water Capacity</h3><span>{formatNumber(converter('volume', 'l', 'gal', specs.watercapacity))} <small>gal</small></span></li> : null}
          {specs.holdingtank ? <li><h3>Holding Tank Capacity</h3><span>{formatNumber(converter('volume', 'l', 'gal', specs.holdingtank))} <small>gal</small></span></li> : null}
          {specs.ballast ? <li><h3>Ballast</h3><span>{formatNumber(converter('mass', 'kg', 'lb', specs.ballast))} <small>lb</small></span></li> : null}

          {specs.berths ? <li><h3>Berths</h3><span>{specs.berths}</span></li> : null}
          {specs.cabins ? <li><h3>Cabins</h3><span>{specs.cabins}</span></li> : null}


          {specs.certification && <li><h3>Certification</h3><span>{specs.certification}</span></li>}
          {specs.hullid && <li><h3>Hull Id</h3><span>{specs.hullid}</span></li>}
          {specs.registry && <li><h3>Registery</h3><span>{specs.registry}</span></li>}
          {specs.name && <li><h3>Name</h3><span>{specs.name}</span></li>}

        </ul>

        <div class="media-flex">
          {mediaStack.map((m, i) => (<div><img class="hover-zoom" onClick={() => { this.overlay = { kind: 'media', selected: i } }} src={cdnAsset(m.info, 'jpg', 't_small_image')} /></div>))}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: '#eee', color: '#666', borderRadius: '0.25rem' }} class="hover-zoom" onClick={() => { this.overlay = { kind: 'media', selected: 0 } }}>
            <bb-icon icon="fa-regular:images"></bb-icon>
            {mediaLength}
          </div>
        </div>

        <div style={{ position: 'relative', overflow: this.showContent ? 'visible' : 'hidden', maxHeight: this.showContent ? 'none' : '20rem', margin: '1rem', fontSize: '1rem', lineHeight: '1.4rem', padding: '1px 0' }}>
          <bb-content content={content}></bb-content>
          {!this.showContent && <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', display: 'flex', padding: '3rem 1rem 1rem 1rem', justifyContent: 'center', background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(255,255,255,1) 75%)' }}>
            <button class="content-more-button" type="button" onClick={() => { this.showContent = true; }}>Show More</button>
          </div>}
        </div>

        <div>
          {listing.variants && listing.variants.map(variant => (
            <div style={{ display: 'flex', alignItems: 'center', color: '#000', padding: '1rem' }}>
              <div>
                <div style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>{variant.label}</div>
                {!variant.amount ? <strong style={{ fontSize: '1.5rem', fontWeight: '600' }}>Price on Request</strong> : <strong style={{ fontSize: '1.5rem', fontWeight: '600' }}>{formatCurrency(variant.amount, variant.currency)}{variant.rate != 'once' && <small style={{ opacity: '0.5', fontWeight: '100', fontSize: '0.9rem' }}>/{variant.rate}</small>}</strong>}
              </div>

              <div style={{ flex: 'auto', marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid #eee' }}>
                <h5 style={{ margin: '0', fontSize: '1rem' }}>{variant.name}</h5>
                <p style={{ color: '#aaa', fontWeight: '300', margin: '0' }}>{variant.description}</p>
              </div>

              <div>
                {variant.action == 'contact' && <button class="contact-button" style={{ padding: '0.75rem', fontSize: '1rem', fontWeight: '500' }} onClick={() => this.overlay = { kind: 'contact' }}>{variant.button || 'Contact'}</button>}
                {variant.action == 'link' && <a class="contact-button" href={variant.link} style={{ padding: '0.75rem', fontSize: '1rem', fontWeight: '500' }}>{variant.button || 'Link'}</a>}
              </div>
            </div>

          ))}
        </div>
      </div>


      {this.overlay && this.overlay.kind == 'spinner' && <div style={{ position: 'fixed', zIndex: '999999', top: '0', left: '0', width: '100%', height: '100%', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(5px)' }}>
        <button onClick={() => this.overlay = null} style={{ cursor: 'pointer', position: 'absolute', top: '3px', right: '3px', padding: '9px', borderRadius: '3px', appearance: 'none', border: 'none', background: 'rgba(0,0,0,0.5)', color: 'white' }}>
          <bb-icon icon="fe:close" color="white" size="2rem"></bb-icon>
        </button>
        <bb-icon icon="icomoon-free:spinner9" class="spin" size="2rem" color="#cde" style={{ x: '-1rem', width: '2rem', display: 'block', margin: '40vh auto' }}></bb-icon>
      </div>}

      {this.overlay && this.overlay.kind == 'contact' && <div style={{ position: 'fixed', zIndex: '999999', top: '0', left: '0', width: '100%', height: '100%', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(5px)' }}>
        <button onClick={() => this.overlay = null} style={{ cursor: 'pointer', position: 'absolute', top: '3px', right: '3px', padding: '9px', borderRadius: '3px', appearance: 'none', border: 'none', background: 'rgba(0,0,0,0.5)', color: 'white' }}>
          <bb-icon icon="fe:close" color="white" size="2rem"></bb-icon>
        </button>
        <form onSubmit={this.sendMessage} class="contact-form" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2>Contact {listing.profile && listing.profile.data && listing.profile.data.name ? ` ${listing.profile.data.name}` : 'Owner'}</h2>
          <input type="text" required placeholder="Name *" value={this.message.name} onChange={(event) => this.message = { ...this.message, name: (event.target as HTMLInputElement).value }}></input>
          <input type="email" required placeholder="Email *" value={this.message.email} onChange={(event) => this.message = { ...this.message, email: (event.target as HTMLInputElement).value }}></input>
          <input type="telephone" placeholder="Telephone" value={this.message.telephone} onChange={(event) => this.message = { ...this.message, telephone: (event.target as HTMLInputElement).value }}></input>
          <textarea required placeholder="Message *" value={this.message.content} onChange={(event) => this.message = { ...this.message, content: (event.target as HTMLInputElement).value }}></textarea>
          <button type="submit">Send Message</button>

        </form>
      </div>}


      {this.overlay && this.overlay.kind == 'media' && <div id="mediaOverlay" style={{ position: 'fixed', zIndex: '999999', top: '0', left: '0', width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(15px)' }}>
        <div style={{ position: 'absolute', bottom: '0', width: '100%', height: '58px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ flex: 'none', display: 'flex', overflowX: 'auto' }}>
            {media.map((m, i) => (<img class="gallery-thumb" onClick={() => { this.overlay = { kind: 'media', selected: i } }} style={{ cursor: 'pointer', borderRadius: '3px', margin: '2px', flex: 'none', objectFit: 'cover', width: '52px', height: '52px' }} src={m.info.thumbnail_url} />))}
          </div>
        </div>
        <div key={this.overlay.selected} style={{ position: 'absolute', left: '0', width: '100%', top: '60px', bottom: '60px', padding: '0 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {selectedMedia.info.resource_type == 'image' && <img onLoad={(ev) => (ev.target as HTMLElement).style.opacity = '1.0'} style={{ opacity: '0', transition: 'opacity 0.5s', borderRadius: '3px', boxShadow: '0 0 20px rgba(0,0,0,0.5)', display: 'block', margin: 'auto', maxWidth: '100%', maxHeight: '100%' }} src={cdnAsset(selectedMedia.info, 'jpg', 't_large_image')} />}
          {selectedMedia.info.resource_type == 'video' && <video onCanPlay={(ev) => (ev.target as HTMLElement).style.opacity = '1.0'} style={{ opacity: '0', transition: 'opacity 0.5s', borderRadius: '3px', boxShadow: '0 0 20px rgba(0,0,0,0.5)', display: 'block', margin: 'auto', maxWidth: '100%', maxHeight: '100%' }} autoplay poster={cdnAsset(selectedMedia.info, 'jpg', 't_large_image')} controls>
            <source src={cdnAsset(selectedMedia.info, 'm3u8', 't_streaming_video')} type="application/x-mpegURL" />
            <source src={cdnAsset(selectedMedia.info, 'mp4', 't_progressive_video')} type="video/mp4" />
            {/*                    
      <source src={cdnAsset(m.info, 'mpd', 't_streaming_video')} type="application/dash+xml" />
      <source src={cdnAsset(m.info, 'webm', 't_progressive_video')} type="video/webm" />
      <source src={cdnAsset(m.info, 'ogv', 't_progressive_video')} type="video/ogg" />
      */}
          </video>}
        </div>

        <button onClick={() => { this.overlay = { kind: 'media', selected: Math.max(0, this.overlay.selected - 1) } }} style={{ display: this.overlay.selected == 0 ? 'none' : 'block', cursor: 'pointer', position: 'absolute', left: '3px', top: '50%', padding: '9px', borderRadius: '3px', appearance: 'none', border: 'none', background: 'rgba(0,0,0,0.1)', color: 'white' }}>
          <bb-icon icon="ic:sharp-arrow-back" color="white" size="2rem"></bb-icon>
        </button>
        <button onClick={() => { this.overlay = { kind: 'media', selected: Math.min(media.length - 1, this.overlay.selected + 1) } }} style={{ display: this.overlay.selected == media.length - 1 ? 'none' : 'block', cursor: 'pointer', position: 'absolute', right: '3px', top: '50%', padding: '9px', borderRadius: '3px', appearance: 'none', border: 'none', background: 'rgba(0,0,0,0.1)', color: 'white' }}>
          <bb-icon icon="ic:sharp-arrow-forward" color="white" size="2rem"></bb-icon>
        </button>
        <button onClick={() => this.overlay = null} style={{ cursor: 'pointer', position: 'absolute', top: '3px', right: '3px', padding: '9px', borderRadius: '3px', appearance: 'none', border: 'none', background: 'rgba(0,0,0,0.1)', color: 'white' }}>
          <bb-icon icon="fe:close" color="white" size="2rem"></bb-icon>
        </button>
        <div style={{ position: 'absolute', top: '5px', height: '50px', left: '60px', right: '60px', color: 'white', opacity: '0.9', display: 'block', textOverflow: 'ellipsis', fontWeight: '300', lineHeight: '16px', fontSize: '14px', textAlign: 'center', overflow: 'hidden', lineClamp: '3' }}>{selectedMedia.description}</div>
      </div>}

      <div style={{ margin: '1rem' }}>
        <div style={{ backgroundColor: '#f1f1f1', borderRadius: '0.5rem', padding: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0' }}>Follow this boat..</h2>
          <form class="watch-form" onSubmit={this.watchListing}>
            <input class="watch-input" required type="email" name="email" autocomplete="email" placeholder="Enter your email address..." value={this.watch.email} onChange={(event) => this.watch = { ...this.watch, email: (event.target as HTMLInputElement).value }}></input>
            <button class="watch-button" type="submit">Watch</button>
          </form>
        </div>
        <div style={{ opacity: '0.5', padding: '0.5rem 0' }}>Listing Created on {(new Date(listing.created)).toDateString()}</div>
      </div>

      {this.updatesResponse?.updates?.length ?
        <div style={{ margin: '1rem' }}>
          <h2 style={{ borderBottom: '2px solid #f1f1f1', paddingBottom: '0.5rem' }}>Blog</h2>
          {this.updatesResponse.updates.map((update) => (<div key={update.id}>
            <h3 style={{ fontWeight: '500', margin: '0' }}>{update.title}</h3>
            <h4 style={{ fontWeight: '300', opacity: '0.5', fontSize: '0.75rem', margin: '0 0 1rem 0' }}>{(new Date(update.created)).toDateString()}</h4>
            <bb-content content={update.content}></bb-content>
          </div>))}
        </div> : <div></div>}


    </Host>
    );

  }

}
