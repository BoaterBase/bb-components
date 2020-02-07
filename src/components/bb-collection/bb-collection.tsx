import { Component, h, Host, Prop, State, Watch } from '@stencil/core';

//let BB_API = 'http://localhost:5000/api'
let BB_API = 'https://www.boaterbase.com/api';


@Component({
  tag: 'bb-collection',
  styleUrl: 'bb-collection.css',
  shadow: true
})
export class BbCollection {
  @Prop() root: string = '/';

  @Prop() collectionPath: string;

  @Prop() collectionHeader: 'none' | 'overlay' | 'image' = 'overlay';
  @Prop() collectionList: 'card' | 'overlay' = 'overlay';

  @Prop() collectionFilters: string = 'manufacturer,model';
  get collectionFiltersList() {
    return this.collectionFilters.split(',');
  }

  @Prop() collectionLocationFilter: string = 'All Locations';
  @Prop() collectionProfileFilter: string = 'All Profiles';

  @State() collectionResponse: any;

  @State() locationFilter = '';
  @State() profileFilter = '';
  @State() specsFilter = {};

  @State() order = 'index';

  get collectionId() {
    // Allow for pretty urls where the id is at the end
    return this.collectionPath.split('-').pop();
  }

  fetchData() {
    return fetch(`${BB_API}/collections/${this.collectionId}`, {
      headers: {
        'Accept': 'application/json',
      },
      method: 'GET'
    }).then();
  }

  async componentWillLoad() {
    //console.log('componentWillLoad')
    this.collectionResponse = await this.fetchData().then(response => response.json());
  }

  @Watch('collectionPath')
  async watchPath() {
    //console.log('Path Changed', newValue, oldValue)
    this.collectionResponse = await this.fetchData().then(response => response.json());
  }


  render() {
    if (!this.collectionResponse)
      return <Host>
        <ion-icon name="help-buoy" class="spin" style={{ width: '2rem', display: 'block', margin: '40vh auto', color: '#cde' }}></ion-icon>
      </Host>
    if (!this.collectionResponse)
      return <Host>Missing</Host>

    let collection = this.collectionResponse;
    let allListings = collection.listings || [];

    const specFilters = this.collectionFiltersList.map((key) => {
      return {
        key,
        title: 'All ' + key.charAt(0).toUpperCase() + key.slice(1) + 's',
        items: [...new Set(allListings.map(l => l.data.specifications[key]).filter(Boolean))]
      };
    });

    const allLocations = [...new Set(allListings.map(l => l.data.location).filter(Boolean))];

    const allProfiles = allListings.map(l => (l.data.profile?.data?.handle && { handle: l.data.profile?.data?.handle, name: l.data.profile?.data?.name || l.data.profile?.data?.handle })).filter(Boolean).filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj.handle).indexOf(obj.handle) === pos;
    })

    // Filters
    let filteredListings: any[any] = collection.listings;
    for (let specKey in this.specsFilter) {
      if (this.specsFilter[specKey]) {
        filteredListings = filteredListings.filter(l => l.data.specifications[specKey] == this.specsFilter[specKey]);
      }
    }
    if (this.locationFilter) {
      filteredListings = filteredListings.filter(l => l.data.location == this.locationFilter);
    }
    if (this.profileFilter) {
      filteredListings = filteredListings.filter(l => l.data.profile?.data?.handle == this.profileFilter);
    }

    return (<Host>
      {this.collectionHeader == 'overlay' && <div class="header" style={{ backgroundImage: collection.header && collection.header.info && collection.header.info.secure_url && `url('${collection.header.info.secure_url}')` }}>
        <svg viewBox="0 0 2 1" style={{ display: 'block', width: '100%' }}></svg>
        <div class="header-overlay">
          <h1 style={{ margin: '0.5rem 1rem' }}>{collection.title}</h1>
          <div style={{ margin: '0.5rem 1rem' }}>{collection.summary}</div>
          <form class="search-form">
            {specFilters.map((f) => (<select class="search-form-select" onChange={({ target }) => this.specsFilter = { ...this.specsFilter, [f.key]: (target as HTMLSelectElement).value }}>
              <option selected={this.specsFilter[f.key] == ''} value="">{f.title}</option>
              {f.items.map((item: string) => <option selected={this.specsFilter[f.key] == item} value={item}>{item}</option>)}
            </select>
            ))}
            <select class="search-form-select" onChange={({ target }) => { this.locationFilter = (target as HTMLSelectElement).value }}>
              <option selected={this.locationFilter == ''} value="">{this.collectionLocationFilter}</option>
              {allLocations.map((item: any) => <option selected={this.locationFilter == item} value={item}>{item}</option>)}
            </select>
            <select class="search-form-select" onChange={({ target }) => { this.profileFilter = (target as HTMLSelectElement).value }}>
              <option selected={this.profileFilter == ''} value="">{this.collectionProfileFilter}</option>
              {allProfiles.map((item: any) => <option selected={this.profileFilter == item.handle} value={item.handle}>{item.name}</option>)}
            </select>
          </form>
        </div>
      </div>}

      {filteredListings && <div class="card-grid">
        {filteredListings.map(listing => <div class="card-grid-item"><bb-listing-card listingId={listing.id} listingData={listing.data} root={this.root} display={this.collectionList}></bb-listing-card></div>)}
        <div class="card-grid-item"></div>
      </div>}

    </Host>)
  }

}
