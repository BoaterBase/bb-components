import { Component, Prop, Host, h, State, Event, EventEmitter, Watch } from '@stencil/core';

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

  render() {
    console.log('profile', this.profileResponse);

    if (!this.profileResponse)
      return <Host>Loading...</Host>
    else if (!this.profileResponse.id)
      return <Host>Missing!</Host>
    else {
      const profile = this.profileResponse;
      const collections = this.profileResponse.collections;

      //const featuredCollection = collections && collections[0];

      // Combine all collections
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

      return <Host>
        {this.profileHeader == 'overlay' && <div class="header" style={{ backgroundImage: profile.header && profile.header.info && profile.header.info.secure_url && `url('${profile.header.info.secure_url}')` }}>
          <svg viewBox="0 0 2 1" style={{ display: 'block', width: '100%' }}></svg>
          <div class="header-overlay">
            {profile.avatar && profile.avatar.info && profile.avatar.info.secure_url && <img src={profile.avatar.info.secure_url} class="header-avatar" />}
            <h1 style={{ margin: '0.5rem 1rem' }}>{profile.name}</h1>
            <div style={{ display: 'none', margin: '0.5rem 1rem' }}>{profile.summary}</div>
          </div>
        </div>}

        {collections && <div style={{ display: 'flex', margin: '-0.5rem 0.5rem', overflow: 'auto' }}>
          {collections.map((collection) => (<a onClick={this.linkClickHandler(`collections/${collection.id}`)} href={`${this.root}collections/${collection.id}`} class={`collection-header collection-header-${collection.id}`}>
            <svg viewBox="0 0 4 1" style={{ display: 'block', width: '100%' }}></svg>
            <div style={{ position: 'absolute', left: '0', width: '100%', bottom: '0', padding: '0.5rem' }}>{collection.data.title}</div>
          </a>))}
        </div>}

        <form style={{ display: 'none' }} class="search-form">
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
        </div>}
        {(this.loadCount < filteredCount) && <button ref={this.loadMoreRefHandler} onClick={this.loadMoreClickHandler}>Load More</button>}
      </Host>
    }
  }

}
