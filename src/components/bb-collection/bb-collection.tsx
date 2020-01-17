import { Component, Host, Prop, State, h } from '@stencil/core';
import { fb } from '../../utils/utils';
import { firestore } from 'firebase';

@Component({
  tag: 'bb-collection',
  styleUrl: 'bb-collection.css',
  shadow: true
})
export class BbCollection {
  @Prop() collectionPath: string;
  @Prop() root: string = '/';

  @Prop() collectionHeader: 'none' | 'overlay' | 'image' = 'overlay';

  @State() collectionsSnaphot: firestore.DocumentSnapshot;

  get collectionId() {
    // Allow for pretty urls where the id is at the end
    return this.collectionPath.split('-').pop();
  }

  async componentWillLoad() {
    console.log('componentWillLoad')
    this.collectionsSnaphot = await fb.firestore().collection('collections').doc(this.collectionId).get();
  }

  async componentWillUpdate() {
    console.log('componentWillUpdate')
    this.collectionsSnaphot = await fb.firestore().collection('collections').doc(this.collectionId).get();
  }

  render() {
    if (!this.collectionsSnaphot)
      return <Host>
        <ion-icon name="help-buoy" class="spin" style={{ width: '2rem', display: 'block', margin: '40vh auto', color: '#cde' }}></ion-icon>
      </Host>
    if (!this.collectionsSnaphot.exists)
      return <Host>Missing</Host>

    let collection = this.collectionsSnaphot.data();

    let filteredListings = collection.listings;

    return (<Host>
      {this.collectionHeader == 'overlay' && <div class="header" style={{ backgroundImage: collection.header && collection.header.info && collection.header.info.secure_url && `url('${collection.header.info.secure_url}')` }}>
        <svg viewBox="0 0 3 1" style={{ display: 'block', width: '100%' }}></svg>
        <div class="header-overlay">
          <h1 style={{ margin: '0.5rem 1rem' }}>{collection.title}</h1>
          <div style={{ margin: '0.5rem 1rem' }}>{collection.summary}</div>
        </div>
      </div>}

      {filteredListings && <div class="card-grid">
        {filteredListings.map(listing => <div class="card-grid-item"><bb-listing-card listingId={listing.id} listingData={listing.data} root={this.root}></bb-listing-card></div>)}
        <div class="card-grid-item"></div>
      </div>}
    </Host>)
  }

}
