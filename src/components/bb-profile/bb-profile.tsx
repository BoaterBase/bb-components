import { Component, Prop, Host, h, State, Event, EventEmitter, Watch } from '@stencil/core';
import { cdnAsset, buildMetaData } from '../../utils/utils';
import { Head } from 'stencil-head';

let BB_API = 'https://www.boaterbase.com/api';

@Component({
  tag: 'bb-profile',
  styleUrl: 'bb-profile.css',
  shadow: true
})
export class BbProfile {

  @Prop() profilePath: string;
  @Prop() root: string = '/';

  @Prop() profileHeader: 'none' | 'overlay' | 'image' = 'overlay';

  @State() profileResponse: any;

  @State() overlay: { kind: '' | 'spinner' | 'contact', selected?: number } = {
    kind: '',
    selected: 0,
  };

  @State() message = {
    name: '',
    email: '',
    telephone: '',
    content: ''
  };
  @State() filter = {
    collection: '',
    model: '',
    manufacturer: '',
    location: ''
  };

  @Event({
    eventName: 'linkClick',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) linkClick: EventEmitter;

  linkClickHandler = (path) => (ev) => {
    let event = this.linkClick.emit({
      path: path
    });

    if (event.defaultPrevented) {
      ev.preventDefault();
    }
  }

  fetchData() {
    return fetch(`${BB_API}/profiles/${this.profilePath}`, {
      headers: {
        'Accept': 'application/json',
      },
      method: 'GET'
    }).then();
  }

  async componentWillLoad() {
    //console.log('componentWillLoad')
    this.profileResponse = await this.fetchData().then(response => response.json());
    //console.log(this.collectionResponse)
  }

  async componentDidLoad() {
    window.scrollTo(0, 0);
  }

  @Watch('profilePath')
  async watchPath() {
    //console.log('Path Changed', newValue, oldValue)
    this.profileResponse = await this.fetchData().then(response => response.json());
  }

  @State() loadCount = 6;

  @Watch('filter')
  watchFilterHandler() {
    // Reset the load count
    this.loadCount = 6;
  }

  private loadMoreIntersectionObserver?: IntersectionObserver;

  loadMoreRefHandler = (button) => {

    if ('IntersectionObserver' in window) {
      if (button) {
        this.loadMoreIntersectionObserver && this.loadMoreIntersectionObserver.disconnect();
        this.loadMoreIntersectionObserver = new IntersectionObserver(data => {
          if (data[0].isIntersecting) {
            this.loadCount = this.loadCount + 6;
          }
        });
        this.loadMoreIntersectionObserver.observe(button);
      } else {
        // ref is called with null when removed so remove the observer        
        this.loadMoreIntersectionObserver && this.loadMoreIntersectionObserver.disconnect();
      }
    }
  }

  loadMoreClickHandler = () => {
    this.loadCount = this.loadCount + 6;
  }

  sendMessage = async (ev: Event) => {
    ev.preventDefault();

    this.overlay = {
      kind: 'spinner',
      selected: 0
    };

    let response = await fetch(`${BB_API}/profiles/${this.profileResponse.id}/messages`, {
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


  render() {
    console.log('profile', this.profileResponse);

    if (!this.profileResponse)
      return <Host>Loading...</Host>
    else if (!this.profileResponse.id)
      return <Host>Missing!</Host>
    else {
      const profile = this.profileResponse;
      let collections: any[] = this.profileResponse.collections || [];

      // TODO - temporary hack to push featured to top
      collections = collections.sort((a: any, _b: any) => (a.data.title.toLowerCase().includes('feature') ? -1 : 1))

      // All listings fallback
      let allListings: any = this.profileResponse.listings || [];

      // Only unique
      allListings = allListings && allListings.filter((obj, index, arr) => arr.findIndex(f => (f.id === obj.id)) === index);

      const models: any = allListings && [...new Set(allListings.map(l => l.data.specifications.model).filter(Boolean))];
      const manufacturers: any = allListings && [...new Set(allListings.map(l => l.data.specifications.manufacturer).filter(Boolean))];
      const locations: any = allListings && [...new Set(allListings.map(l => l.data.location).filter(Boolean))];

      let filteredListings = allListings;

      if (this.filter.collection) {
        filteredListings = filteredListings && collections.filter(({ id }) => id == this.filter.collection)[0].data.listings;
      }
      if (this.filter.model) {
        filteredListings = filteredListings && filteredListings.filter(l => l.data.specifications.model == this.filter.model);
      }

      if (this.filter.manufacturer) {
        filteredListings = filteredListings && filteredListings.filter(l => l.data.specifications.manufacturer == this.filter.manufacturer);
      }


      if (this.filter.location) {
        filteredListings = filteredListings && filteredListings.filter(l => l.data.location == this.filter.location);
      }

      const filteredCount = filteredListings ? filteredListings.length : 0;
      filteredListings = filteredListings && filteredListings.slice(0, this.loadCount);

      const meta = buildMetaData(profile.name || profile.handle, profile.summary, 'profile', profile?.header?.info?.secure_url && cdnAsset(profile.header.info, 'jpg', 't_large_image'));

      return <Host>
        <div style={{ display: 'none' }}><Head data={meta}></Head></div>

        {this.profileHeader == 'overlay' && <div class="header" style={{ backgroundImage: profile.header && profile.header.info && profile.header.info.secure_url && `url('${cdnAsset(profile.header.info, 'jpg', 't_large_image')}')` }}>
          <svg viewBox="0 0 3 1" style={{ display: 'block', width: '100%' }}></svg>
          <div class="header-overlay" style={{ display: 'none' }}>
            {profile.avatar && profile.avatar.info && profile.avatar.info.secure_url && <img src={profile.avatar.info.secure_url} class="header-avatar" />}
            <h1 style={{ margin: '0.5rem 1rem' }}>{profile.name || profile.handle}</h1>
            <div style={{ margin: '0.5rem 1rem' }}>{profile.summary}</div>
            <div style={{ display: 'flex', padding: '0.25rem' }}>
              <button class="contact-button" onClick={() => this.overlay = { kind: 'contact' }}>Send Message</button>
              {profile?.data?.email && <a class="contact-button" href={`javascript:window.location.href='mailto:'+atob('${btoa(profile?.data?.email)}')`}>Email</a>}
              {profile?.data?.telephone && <a class="contact-button" href={`javascript:window.location.href='tel:'+atob('${btoa(profile?.data?.telephone)}')`}>Call</a>}
            </div>
          </div>
        </div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'end' }}>
          {profile.avatar && profile.avatar.info && profile.avatar.info.secure_url && <img src={profile.avatar.info.secure_url} class="header-avatar" />}
          <div style={{ flex: '1 1 500px', display: 'flex', alignItems: 'start', margin: '0 1rem 2rem 1rem' }}>
            <div>
              <h1 style={{ margin: '0', fontSize: '1.35rem', fontWeight: '600' }}>{profile.name || profile.handle}</h1>
              <p style={{ margin: '0', fontSize: '1rem', opacity: '0.75' }}>{profile.summary}</p>
              <div style={{ fontSize: '0.9rem', opacity: '0.5', marginTop: '0.25rem' }}>{profile.location} {profile.website && <a href={profile.website} class="link-button"><i style={{ display: 'inline-block', width: '1rem', height: '1rem', background: `url('https://api.iconify.design/fa-solid:link.svg')` }}></i> Website</a>} {profile.twitter && <a href={profile.twitter} class="link-button"><i style={{ display: 'inline-block', width: '1rem', height: '1rem', background: `url('https://api.iconify.design/fa:twitter-square.svg')` }}></i> Twitter</a>} {profile.facebook && <a href={profile.facebook} class="link-button"><i style={{ display: 'inline-block', width: '1rem', height: '1rem', background: `url('https://api.iconify.design/brandico:facebook-rect.svg')` }}></i> Facebook</a>}</div>
            </div>
          </div>
          <div style={{ padding: '0.25rem', margin: '0 1rem', flex: 'none' }}>
            <button class="contact-button" onClick={() => this.overlay = { kind: 'contact' }}>Send Message</button>
            {profile?.email && <a class="contact-button" href={`javascript:window.location.href='mailto:'+atob('${btoa(profile?.email)}')`}>Email</a>}
            {profile?.telephone && <a class="contact-button" href={`javascript:window.location.href='tel:'+atob('${btoa(profile?.telephone)}')`}>Call</a>}
          </div>
        </div>


        {collections && <div>
          {collections.map((collection) => (<div>

            <a style={{ display: 'flex', alignItems: 'center', margin: '0.5rem 1rem', fontWeight: '300', textDecoration: 'none', color: 'inherit', }} onClick={this.linkClickHandler(`collections/${collection.id}`)} href={`${this.root}collections/${collection.id}`}>
              <h2 style={{ flex: 'auto', textDecoration: 'none', color: 'inherit', margin: '0', fontSize: '1.3rem' }}>{collection.data.title}</h2>
              <span>All <i style={{ display: 'inline-block', width: '1rem', height: '1rem', background: `url('https://api.iconify.design/ion:arrow-forward-sharp.svg')` }}></i></span>
            </a>
            <div class="card-grid">
              {collection.listings.map(listing => <div class="card-grid-item">
                <bb-listing-card listingId={listing.id} listingData={listing.data} root={this.root}></bb-listing-card>
              </div>)}
              <div class="card-grid-item"></div>
              <div class="card-grid-item"></div>
            </div>


          </div>))}
        </div>}

        {(!collections || collections.length == 0) && <div>
          <form class="search-form">
            <select class="search-form-select" onChange={({ target }) => this.filter = { ...this.filter, location: (target as HTMLSelectElement).value }}>
              <option selected={this.filter.location == ''} value="">All Locations</option>
              {locations && locations.map(location => <option selected={this.filter.location == location} value={location}>{location}</option>)}
            </select>
            <select class="search-form-select" onChange={({ target }) => this.filter = { ...this.filter, model: (target as HTMLSelectElement).value }}>
              <option selected={this.filter.model == ''} value="">All Models</option>
              {models && models.map(model => <option selected={this.filter.model == model} value={model}>{model}</option>)}
            </select>
            <select class="search-form-select" onChange={({ target }) => this.filter = { ...this.filter, manufacturer: (target as HTMLSelectElement).value }}>
              <option selected={this.filter.manufacturer == ''} value="">All Manufacturers</option>
              {manufacturers && manufacturers.map(manufacturer => <option selected={this.filter.manufacturer == manufacturer} value={manufacturer}>{manufacturer}</option>)}
            </select>
          </form>

          {filteredListings && <div class="card-grid">
            {filteredListings.map(listing => <div class="card-grid-item">
              <bb-listing-card listingId={listing.id} listingData={listing.data} root={this.root}></bb-listing-card>
            </div>)}
            <div class="card-grid-item"></div>
            <div class="card-grid-item"></div>
          </div>}
          {(this.loadCount < filteredCount) && <button ref={this.loadMoreRefHandler} onClick={this.loadMoreClickHandler}>Load More</button>}
        </div>}

        {this.overlay && this.overlay.kind == 'contact' && <div style={{ position: 'fixed', zIndex: '999999', top: '0', left: '0', width: '100%', height: '100%', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(5px)' }}>
          <button onClick={() => this.overlay = null} style={{ cursor: 'pointer', position: 'absolute', top: '3px', right: '3px', padding: '9px', borderRadius: '3px', appearance: 'none', border: 'none', background: 'rgba(0,0,0,0.5)', color: 'white' }}>
            <bb-icon icon="fe:close" color="white" size="2rem"></bb-icon>
          </button>
          <form onSubmit={this.sendMessage} class="contact-form" style={{ display: 'flex', flexDirection: 'column' }}>
            <h2>Contact {profile.name || profile.handle || profile.id}</h2>
            <input type="text" required placeholder="Name *" value={this.message.name} onChange={(event) => this.message = { ...this.message, name: (event.target as HTMLInputElement).value }}></input>
            <input type="email" required placeholder="Email *" value={this.message.email} onChange={(event) => this.message = { ...this.message, email: (event.target as HTMLInputElement).value }}></input>
            <input type="telephone" placeholder="Telephone" value={this.message.telephone} onChange={(event) => this.message = { ...this.message, telephone: (event.target as HTMLInputElement).value }}></input>
            <textarea required placeholder="Message *" value={this.message.content} onChange={(event) => this.message = { ...this.message, content: (event.target as HTMLInputElement).value }}></textarea>
            <button type="submit">Send Message</button>

          </form>
        </div>}
      </Host>
    }
  }

}
