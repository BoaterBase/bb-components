import { Component, h, Host, Prop, State, Watch } from '@stencil/core';
import { cdnAsset } from '../../utils/utils';

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

  @State() sortOrder = 'featured';

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
    //console.log(this.collectionResponse)
  }

  @Watch('collectionPath')
  async watchPath() {
    //console.log('Path Changed', newValue, oldValue)
    this.collectionResponse = await this.fetchData().then(response => response.json());
  }


  render() {
    if (!this.collectionResponse)
      return <Host>
        Loading...
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
    if (this.sortOrder == 'price_asc') {
      filteredListings = filteredListings.sort((a, b) => ((a.data.price || Number.MAX_VALUE) - (b.data.price || Number.MAX_VALUE)));
    }
    if (this.sortOrder == 'price_desc') {
      filteredListings = filteredListings.sort((a, b) => ((b.data.price || 0) - (a.data.price || 0)));
    }
    if (this.sortOrder == 'length_asc') {
      filteredListings = filteredListings.sort((a, b) => ((a.data.specifications?.loa || Number.MAX_VALUE) - (b.data.specifications?.loa || Number.MAX_VALUE)));
    }
    if (this.sortOrder == 'length_desc') {
      filteredListings = filteredListings.sort((a, b) => ((b.data.specifications?.loa || 0) - (a.data.specifications?.loa || 0)));
    }
    if (this.sortOrder == 'year_asc') {
      filteredListings = filteredListings.sort((a, b) => ((a.data.specifications?.year || Number.MAX_VALUE) - (b.data.specifications?.year || Number.MAX_VALUE)));
    }
    if (this.sortOrder == 'year_desc') {
      filteredListings = filteredListings.sort((a, b) => ((b.data.specifications?.year || 0) - (a.data.specifications?.year || 0)));
    }
    if (this.sortOrder == 'updated_asc') {
      filteredListings = filteredListings.sort((a, b) => {
        if (a.data.updated > b.data.updated) {
          return 1;
        }
        if (a.data.updated < b.data.updated) {
          return -1;
        }
        return 0;
      });
    }
    if (this.sortOrder == 'updated_desc') {
      filteredListings = filteredListings.sort((a, b) => {
        if (a.data.updated < b.data.updated) {
          return 1;
        }
        if (a.data.updated > b.data.updated) {
          return -1;
        }
        return 0;
      });
    }

    return (<Host>
      {this.collectionHeader == 'overlay' && <div class="header" style={{ backgroundColor: collection?.header?.info?.colors[0]?.color, backgroundImage: collection.header && collection.header.info && collection.header.info.secure_url && `url('${cdnAsset(collection.header.info, 'jpg', 't_large_image')}')` }}>
        <svg viewBox="0 0 2 1" style={{ display: 'block', width: '100%', minHeight: '300px' }}></svg>
        <div class="header-overlay">
          <div class="header-text">
            <h1>{collection.title}</h1>
            <p>{collection.summary}</p>
          </div>
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
      {filteredListings && <form class="sort-form">
        <h2 class="sort-title">{filteredListings.length} Listings</h2>
        <div class="sort-layout">
          <button>Card <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10.5" cy="10.5" r="9.5" fill="#FFB056" stroke="#F2994A" stroke-width="2" />
          </svg>
          </button>
          <button><iconify-icon class="iconify" data-icon="mdi-home"></iconify-icon> List</button>
          <button>
            <i style={{ display: 'inline-block', width: '1rem', height: '1rem', background: `url('https://api.iconify.design/ion:grid.svg')` }}></i>
            <span>Gallery</span>
          </button>
        </div>
        <select class="sort-order" onChange={({ target }) => { this.sortOrder = (target as HTMLSelectElement).value }}>
          <option value="featured">Featured</option>
          <hr />
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
          <hr />
          <option value="length_asc">Length ↑</option>
          <option value="length_desc">Length ↓</option>
          <hr />
          <option value="year_asc">Year ↑</option>
          <option value="year_desc">Year ↓</option>
          <hr />
          <option value="updated_asc">Updated ↑</option>
          <option value="updated_desc">Updated ↓</option>
        </select>
      </form>}
      {filteredListings && <div class="card-grid">
        {filteredListings.map(listing => {
          let mergedListing = {
            ...listing.data,
            title: listing.title || listing.data.title,
            message: listing.message || listing.data.message,
            messageDisplay: listing.messageDisplay
          };

          return <div key={listing.id} class="card-grid-item"><bb-listing-card listingId={listing.id} listingData={mergedListing} root={this.root} display={this.collectionList}></bb-listing-card></div>
        })}
        <div class="card-grid-item"></div>
      </div>}

    </Host>)
  }

}
