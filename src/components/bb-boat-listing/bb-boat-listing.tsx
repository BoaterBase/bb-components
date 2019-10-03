import { Component, Host, Prop, h, State } from '@stencil/core';
import FireStoreParser from 'firestore-parser';

const apiPath = `https://firestore.googleapis.com/v1/projects/boaterbase-v2/databases/(default)/`
const imagePath = `https://res.cloudinary.com/boaterbase/image/upload/`;

@Component({
  tag: 'bb-boat-listing',
  styleUrl: 'bb-boat-listing.css',
  shadow: true
})
export class BbBoatListing {
  @Prop() boatId: string;
  @Prop() padding: string;

  @State() boatData: any;
  @State() loaded: boolean = false;

  async componentWillLoad() {
    this.boatData = await fetch(apiPath + 'documents/listings/' + this.boatId).then((r) => r.json()).then(json => FireStoreParser(json));
    console.log(this.boatData)
  }

  render() {
    if (this.boatData && this.boatData.fields) {
      const boat = this.boatData.fields;

      return (
        <Host>
          <div style={{ position: 'relative' }}>
            <img style={{ display: 'block', width: '100%', height: '100vh', objectFit: 'fill' }} src={`${imagePath}${boat.media[0].info.public_id}`} />
            <div style={{
              position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', backgroundColor: 'rgba(0,30,50,0.25)'
            }}>
              <div style={{ padding: '2rem' }}>
                <h1 class="title">{boat.title}</h1>
                <div class="info">
                  <span><ion-icon name="boat" style={{ fontSize: '115%' }}></ion-icon> {boat.specifications.type}</span>
                  <span><ion-icon name="man" style={{ fontSize: '115%' }}></ion-icon> {boat.specifications.passengers} Passengers</span>
                  <span><ion-icon name="bed" style={{ fontSize: '115%' }}></ion-icon> {boat.specifications.cabins} Cabins</span>
                </div>
                <p class="summary">{boat.summary}</p>
                <button class="contact-button">Contact</button>
              </div>
            </div>
          </div>


          <div>
            Content <ion-icon name="heart"></ion-icon>
          </div>
        </Host >
      );
    }
    else
      return (<Host>Loading...</Host>)
  }

}
