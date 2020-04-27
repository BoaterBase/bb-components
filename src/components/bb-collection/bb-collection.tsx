import { Component, h, Host, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { cdnAsset, buildMetaData } from '../../utils/utils';
import { Head } from 'stencil-head';
import { orderBy } from 'natural-orderby';
import groupArray from 'group-array';

//let BB_API = 'http://localhost:5000/api'
let BB_API = 'https://www.boaterbase.com/api';

//const groupBy = function (a, k) {
//  return a.reduce((acc, item) => ((acc[item[k]] = [...(acc[item[k]] || []), item]), acc), {});
//};

@Component({
  tag: 'bb-collection',
  styleUrl: 'bb-collection.css',
  shadow: true
})
export class BbCollection {
  @Prop() root: string = '/';

  @Prop() collectionPath: string;
  @Prop() collectionQuery: {
    location?: '',
    profile?: '',
    specs?: ''
  } = {};

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

  @Event({
    eventName: 'linkClick',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) linkClick: EventEmitter;

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

    if (this.collectionQuery.location) {
      this.locationFilter = this.collectionQuery.location;
    }
    if (this.collectionQuery.profile) {
      this.profileFilter = this.collectionQuery.profile;
    }
    if (this.collectionQuery.specs) {
      try {
        this.specsFilter = JSON.parse(this.collectionQuery.specs);
      }
      catch{
        this.specsFilter = {};
      }
    }
  }

  async componentDidLoad() {
    window.scrollTo(0, 0);
  }

  @Watch('collectionPath')
  async watchPath() {
    //console.log('Path Changed', newValue, oldValue)
    this.collectionResponse = await this.fetchData().then(response => response.json());
  }

  updateRouteFilter() {

    this.linkClick.emit({
      path: `?location=${this.locationFilter}&profile=${this.profileFilter}&specs=${JSON.stringify(this.specsFilter)}`
    });
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
        items: orderBy([...new Set(allListings.map(l => l.data.specifications[key]).filter(Boolean))])
      };
    });

    let allLocations = [...new Set(allListings.map(l => l.data.location && l.data.location.trim()).filter(Boolean))];

    allLocations = orderBy(
      allLocations
    );

    let splitLocations = allLocations.map((l: string) => {
      let ls = l.split(',').filter(Boolean).map(i => i.trim());
      return {
        country: ls.pop(),
        region: ls.pop()
      }
    });


    let groupedLocations = groupArray(splitLocations, 'country', 'region');

    //console.log(splitLocations, groupedLocations);

    let allProfiles = allListings.map(l => (l.data.profile?.data?.handle && { handle: l.data.profile?.data?.handle, name: l.data.profile?.data?.name || l.data.profile?.data?.handle })).filter(Boolean).filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj.handle).indexOf(obj.handle) === pos;
    })

    allProfiles = orderBy(
      allProfiles,
      [(l: any) => l.name]
    );

    // Filters
    let filteredListings: any[any] = collection.listings;
    for (let specKey in this.specsFilter) {
      if (this.specsFilter[specKey]) {
        filteredListings = filteredListings.filter(l => l.data.specifications[specKey] == this.specsFilter[specKey]);
      }
    }
    if (this.locationFilter) {
      filteredListings = filteredListings.filter(l => l.data.location && l.data.location.includes(this.locationFilter));
    }
    if (this.profileFilter) {
      filteredListings = filteredListings.filter(l => l.data.profile?.data?.handle == this.profileFilter);
    }

    if (this.sortOrder == 'price_asc') {
      filteredListings = filteredListings.sort((a, b) => ((a.data.price || Number.MAX_VALUE) - (b.data.price || Number.MAX_VALUE)));
    }
    switch (this.sortOrder) {
      case 'price_desc':
        filteredListings = filteredListings.sort((a, b) => ((b.data.price || 0) - (a.data.price || 0)));
        break;
      case 'length_asc':
        filteredListings = filteredListings.sort((a, b) => ((a.data.specifications?.loa || Number.MAX_VALUE) - (b.data.specifications?.loa || Number.MAX_VALUE)));
        break;
      case 'length_desc':
        filteredListings = filteredListings.sort((a, b) => ((b.data.specifications?.loa || 0) - (a.data.specifications?.loa || 0)));
        break;
      case 'year_asc':
        filteredListings = filteredListings.sort((a, b) => ((a.data.specifications?.year || Number.MAX_VALUE) - (b.data.specifications?.year || Number.MAX_VALUE)));
        break;
      case 'year_desc':
        filteredListings = filteredListings.sort((a, b) => ((b.data.specifications?.year || 0) - (a.data.specifications?.year || 0)));
        break;
      case 'updated_asc':
        filteredListings = filteredListings.sort((a, b) => {
          if (a.data.updated > b.data.updated) {
            return 1;
          }
          if (a.data.updated < b.data.updated) {
            return -1;
          }
          return 0;
        });
        break;
      case 'updated_desc':
        filteredListings = filteredListings.sort((a, b) => {
          if (a.data.updated < b.data.updated) {
            return 1;
          }
          if (a.data.updated > b.data.updated) {
            return -1;
          }
          return 0;
        });
        break;
      default:
        //TODO - check for default sort option

        // Randomish by id % current day
        filteredListings = filteredListings.sort((a, b) => {
          const rnd = (new Date()).getHours();
          const ai = rnd % a.id.length;
          const bi = rnd % b.id.length;
          return a.id.charCodeAt(ai) - b.id.charCodeAt(bi);
        });
    }

    const meta = buildMetaData(collection.title, collection.summary, 'website', collection?.header?.info?.secure_url && cdnAsset(collection.header.info, 'jpg', 't_large_image'));

    return (<Host>
      <div style={{ display: 'none' }}><Head data={meta}></Head></div>

      {this.collectionHeader == 'overlay' && <div class="header" style={{ backgroundColor: collection?.header?.info?.colors[0]?.color, backgroundImage: collection.header && collection.header.info && collection.header.info.secure_url && `url('${cdnAsset(collection.header.info, 'jpg', 't_large_image')}')` }}>
        <svg viewBox="0 0 2 1" style={{ display: 'block', width: '100%', minHeight: '300px' }}></svg>
        <div class="header-overlay">
          <div class="header-text">
            <h1>{collection.title}</h1>
            <p>{collection.summary}</p>
          </div>
          <form class="search-form">
            {specFilters.map((f) => (<select class="search-form-select" onChange={({ target }) => { this.specsFilter = { ...this.specsFilter, [f.key]: (target as HTMLSelectElement).value }; this.updateRouteFilter(); }}>
              <option selected={this.specsFilter[f.key] == ''} value="">{f.title}</option>
              {f.items.map((item: string) => <option selected={this.specsFilter[f.key] == item} value={item}>{item}</option>)}
            </select>
            ))}
            <select class="search-form-select" onChange={({ target }) => { this.locationFilter = (target as HTMLSelectElement).value; this.updateRouteFilter(); }}>
              <option selected={this.locationFilter == ''} value={''}>{this.collectionLocationFilter}</option>
              <hr />
              {Object.keys(groupedLocations).map(c => ([<option selected={this.locationFilter == c} value={c}>{c}</option>, orderBy(Object.keys(groupedLocations[c])).map(r => ([<option selected={this.locationFilter == `${r}, ${c}`} value={`${r}, ${c}`}>— {r}</option>])), <hr />]))}
            </select>
            <select class="search-form-select" onChange={({ target }) => { this.profileFilter = (target as HTMLSelectElement).value; this.updateRouteFilter(); }}>
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
          <option value="featured">Sort</option>
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
