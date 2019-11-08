import { Component, Prop, Host, h, State } from '@stencil/core';
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
    manufacturer: ''
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

      let allListings = collections && collections.reduce((prev, collection) => prev.concat(collection.data.listings), []);
      // Only unique
      allListings = allListings && allListings.filter((obj, index, arr) => arr.findIndex(f => (f.id === obj.id)) === index);

      const models = allListings && [...new Set(allListings.map(l => l.data.specifications.model).filter(Boolean))]
      const manufacturers = allListings && [...new Set(allListings.map(l => l.data.specifications.manufacturer).filter(Boolean))]

      let filteredListings = allListings;

      if (this.filter.collection) {
        filteredListings = collections.filter(({ id }) => id == this.filter.collection)[0].data.listings;
      }
      if (this.filter.model) {
        filteredListings = filteredListings.filter(l => l.data.specifications.model == this.filter.model);
      }

      if (this.filter.manufacturer) {
        filteredListings = filteredListings.filter(l => l.data.specifications.manufacturer == this.filter.manufacturer);
      }

      return <Host>
        <div class="header">
          <h1 style={{ margin: '0' }}>{profile.name}</h1>
          <div style={{ margin: '1rem 0' }}>{profile.summary}</div>

          <form class="search-form">
            <select class="search-select" onChange={({ target }) => this.filter = { ...this.filter, collection: (target as HTMLSelectElement).value }}>
              <option selected={this.filter.collection == ''} value="">All Collections</option>
              {collections && collections.map(collection => <option selected={this.filter.collection == collection.id} value={collection.id}>{collection.data.title}</option>)}
            </select>

            <select class="search-select" onChange={({ target }) => this.filter = { ...this.filter, model: (target as HTMLSelectElement).value }}>
              <option selected={this.filter.model == ''} value="">All Models</option>
              {models && models.map(model => <option selected={this.filter.model == model} value={model}>{model}</option>)}
            </select>
            <select class="search-select" onChange={({ target }) => this.filter = { ...this.filter, manufacturer: (target as HTMLSelectElement).value }}>
              <option selected={this.filter.manufacturer == ''} value="">All Manufacturers</option>
              {manufacturers && manufacturers.map(manufacturer => <option selected={this.filter.manufacturer == manufacturer} value={manufacturer}>{manufacturer}</option>)}
            </select>
          </form>
        </div>
        {filteredListings && <div class="card-list">
          {filteredListings.map(listing => <div class="card-list-item"><bb-listing-card listingId={listing.id} listingData={listing.data} history={this.history}></bb-listing-card></div>)}
        </div>}
      </Host>

    }
  }

}
