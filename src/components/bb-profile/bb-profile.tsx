import { Component, Prop, Host, h, State, Watch } from '@stencil/core';
import { fb } from '../../utils/utils';
import { firestore } from 'firebase';

@Component({
  tag: 'bb-profile',
  styleUrl: 'bb-profile.css',
  shadow: true
})
export class BbProfile {

  @Prop() profilePath: string;
  @Prop() history: any;

  @State() profileSnaphot: firestore.DocumentSnapshot;
  @State() collectionsSnaphot: firestore.QuerySnapshot;

  @State() filter = {
    collection: '',
    model: '',
    manufacturer: '',
    location: ''
  };

  async componentDidLoad() {
    // Handles is a list so we must do a query and grab the first item
    const profilesSnaphot = await fb.firestore().collection('profiles').where('handles', 'array-contains', this.profilePath).get();

    this.profileSnaphot = profilesSnaphot.docs && profilesSnaphot.docs[0];

    if (this.profileSnaphot) {
      // TODO - use attached collections NOT a query
      this.collectionsSnaphot = await fb.firestore().collection('collections').where('uid', '==', this.profileSnaphot.get('uid')).get();
    }
  }

  async componentWillUpdate() {
    // Handles is a list so we must do a query and grab the first item
    const profilesSnaphot = await fb.firestore().collection('profiles').where('handles', 'array-contains', this.profilePath).get();

    this.profileSnaphot = profilesSnaphot.docs && profilesSnaphot.docs[0];

    if (this.profileSnaphot) {
      // TODO - use attached collections NOT a query
      this.collectionsSnaphot = await fb.firestore().collection('collections').where('uid', '==', this.profileSnaphot.get('uid')).get();
    }
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
    if (!this.profileSnaphot)
      return <Host>Loading...</Host>
    else if (!this.profileSnaphot.exists)
      return <Host>Missing!</Host>
    else {
      const profile = this.profileSnaphot.data();
      const collections = this.collectionsSnaphot && this.collectionsSnaphot.docs.map(doc => ({
        id: doc.id,
        ref: doc.ref,
        data: doc.data()
      }));

      //const featuredCollection = collections && collections[0];

      // Combine all collections
      let allListings = collections && collections.reduce((prev, collection) => prev.concat(collection.data.listings), []);
      // Only unique
      allListings = allListings && allListings.filter((obj, index, arr) => arr.findIndex(f => (f.id === obj.id)) === index);

      const models = allListings && [...new Set(allListings.map(l => l.data.specifications.model).filter(Boolean))];
      const manufacturers = allListings && [...new Set(allListings.map(l => l.data.specifications.manufacturer).filter(Boolean))];
      const locations = allListings && [...new Set(allListings.map(l => l.data.location).filter(Boolean))];

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
        <div class="header" style={{ backgroundImage: profile.header && profile.header.info && profile.header.info.secure_url && `url('${profile.header.info.secure_url}')` }}>
          <svg viewBox="0 0 2 1" style={{ display: 'block', width: '100%' }}></svg>
          <div class="header-overlay">
            {profile.avatar && profile.avatar.info && profile.avatar.info.secure_url && <img src={profile.avatar.info.secure_url} class="header-avatar" />}
            <h1 style={{ margin: '0.5rem 1rem' }}>{profile.name}</h1>
            <div style={{ display: 'none', margin: '0.5rem 1rem' }}>{profile.summary}</div>
          </div>
        </div>
        {collections && <div style={{ display: 'flex', margin: '-0.5rem 0.5rem', overflow: 'auto' }}>
          {collections.map((collection) => (<a onClick={() => this.filter = { ...this.filter, collection: collection.id }} style={{ position: 'relative', flex: '2 0 250px', color: '#fff', fontSize: '1.1rem', fontWeight: '500', background: 'skyblue', borderRadius: '0.5rem', margin: '0.5rem' }}>
            <svg viewBox="0 0 4 1" style={{ display: 'block', width: '100%' }}></svg>
            <div style={{ position: 'absolute', left: '0', width: '100%', bottom: '0', padding: '0.5rem' }}>{collection.data.title}</div>
          </a>))}
        </div>}

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
            <bb-listing-card listingId={listing.id} listingData={listing.data} history={this.history}></bb-listing-card>
          </div>)}
          <div class="card-grid-item"></div>
        </div>}
        {(this.loadCount < filteredCount) && <button ref={this.loadMoreRefHandler} onClick={this.loadMoreClickHandler}>Load More</button>}
      </Host>
    }
  }

}
