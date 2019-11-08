import { Component, Host, Prop, h, State, Element } from '@stencil/core';
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
  @Prop() inset: number = 0;
  @Prop() autoPlay: boolean = false;

  @State() boatData: any;
  @State() loaded: boolean = false;

  @State() expanded: boolean = false;
  @State() mediaItem: number = 0;

  @Element() el: HTMLElement;

  mediaInterval = null;

  async componentWillLoad() {
    this.boatData = await fetch(apiPath + 'documents/listings/' + this.boatId).then((r) => r.json()).then(json => FireStoreParser(json));
    if (this.autoPlay && this.boatData.fields.media && this.boatData.fields.media.length) {
      this.mediaInterval = setInterval(() => this.mediaItem = (this.mediaItem + 1) % this.boatData.fields.media.length, 5000)
    }
    console.log(this.boatData)
  }

  componentDidLoad() {

  }

  render() {
    if (this.boatData && this.boatData.fields) {
      const boat = this.boatData.fields;
      const specs = boat.specifications || {};
      return (
        <Host>
          <div style={{ position: 'relative', margin: this.inset + 'px', borderRadius: this.inset + 'px', overflow: 'hidden', boxShadow: this.inset ? `0 0 ${this.inset}px rgba(0,10,20,0.5)` : 'none' }}>
            <img key={boat.media[this.mediaItem].id} onLoad={(ev) => (ev.target as any).style.opacity = 1.0} style={{ transition: 'opacity 0.5s', opacity: '0', backgroundColor: boat.media[this.mediaItem].info.colors ? boat.media[this.mediaItem].info.colors[0].color : 'black', display: 'block', width: '100%', height: `calc(100vh - ${this.inset * 2}px)`, objectFit: this.expanded ? 'contain' : 'cover' }} sizes="100vw" src={`${imagePath}c_scale,w_auto,dpr_auto,q_auto,fl_lossy,f_auto/c_limit,w_2000/${boat.media[this.mediaItem].info.public_id}`} />
            {<div class="media-overlay" style={{ width: '50%', opacity: this.expanded ? '0' : '1.0', pointerEvents: this.expanded ? 'none' : 'auto' }}>
              <div style={{}}>
                <h1 class="title">{boat.title}</h1>
                <div class="info">
                  <span onClick={() => this.el.shadowRoot.querySelector('.specifications').scrollIntoView({ behavior: "smooth" })}><ion-icon name="ios-information-circle-outline" style={{ fontSize: '115%' }}></ion-icon> {boat.specifications.type}</span>
                  <span onClick={() => this.el.shadowRoot.querySelector('.location').scrollIntoView({ behavior: "smooth" })}><ion-icon name="ios-pin" style={{ fontSize: '115%' }}></ion-icon> Newport, RI, USA</span>
                </div>
                <p class="summary">{boat.summary}</p>
                <div>
                  <button onClick={() => this.el.shadowRoot.querySelector('.pricing').scrollIntoView({ behavior: "smooth" })} style={{ color: 'white', fontSize: '1.2rem', fontWeight: '700', textShadow: '0 0 5px rgba(0, 0, 0, 0.5)', margin: '0.5rem 0', padding: '0', background: 'none', border: 'none' }}>Charter from $1000<small style={{ fontWeight: '300' }}>/day</small></button>
                </div>
                <button onClick={() => this.el.shadowRoot.querySelector('.contact').scrollIntoView({ behavior: "smooth" })} class="contact-button">Contact</button>
              </div>
            </div>}
            <div style={{ position: 'absolute', bottom: '1rem', width: '100%', fontSize: '1.3rem', color: 'rgba(255,255,255,0.5)', display: 'flex', justifyContent: 'center' }}>
              {boat.media.map((_m, i) => (
                <span>
                  <ion-icon onClick={() => { this.mediaItem = i; }} name={i == this.mediaItem ? "ios-radio-button-on" : "ios-radio-button-off"}></ion-icon>
                </span>
              ))}
            </div>
            <button onClick={() => { this.expanded = !this.expanded; }} style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'transparent', border: 'none', color: 'white' }}><ion-icon size="large" name={this.expanded ? "ios-contract" : "ios-expand"}></ion-icon></button>
            <button onClick={() => this.el.shadowRoot.querySelector('main').scrollIntoView({ behavior: "smooth" })} style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'white' }}><ion-icon size="large" name="ios-arrow-round-down"></ion-icon></button>
          </div>
          <main style={{ overflow: 'auto' }}>
            <div class="specifications" style={{ overflow: 'auto' }}>
              <h2>Specifications</h2>
              <ul>
                {specs.classification && <li><h3>Classification</h3><span>{specs.classification}</span></li>}
                {specs.type && <li><h3>Type</h3><span>{specs.type}</span></li>}
                {specs.manufacturer && <li><h3>Manufacturer</h3><span>{specs.manufacturer}</span></li>}
                {specs.model && <li><h3>Model</h3><span>{specs.model}</span></li>}
                {specs.designer && <li><h3>Designer</h3><span>{specs.designer}</span></li>}
                {specs.profile && <li><h3>Profile</h3><span>{specs.profile}</span></li>}

                {specs.loa && <li><h3>Length Overall</h3><span>{specs.loa} <small>m</small></span></li>}
                {specs.hoa && <li><h3>Height Overall</h3><span>{specs.hoa} <small>m</small></span></li>}
                {specs.beam && <li><h3>Beam</h3><span>{specs.beam} <small>m</small></span></li>}
                {specs.draft && <li><h3>Draft</h3><span>{specs.draft} <small>m</small></span></li>}

                {specs.displacement && <li><h3>Displacement</h3><span>{specs.displacement} <small>kg</small></span></li>}
                {specs.certification && <li><h3>Certification</h3><span>{specs.certification}</span></li>}

                {specs.engines && <li><h3>Engines</h3><span>{specs.engines}</span></li>}
                {specs.power && <li><h3>Engine Power</h3><span>{specs.power} <small>kW</small></span></li>}

                {specs.fueltank && <li><h3>Fuel Tank</h3><span>{specs.fueltank} <small>kW</small></span></li>}
                {specs.watertank && <li><h3>Water Tank</h3><span>{specs.watertank} <small>kW</small></span></li>}

                {specs.hullid && <li><h3>Hull Id</h3><span>{specs.hullid}</span></li>}
                {specs.registry && <li><h3>Registery</h3><span>{specs.registry}</span></li>}

                {specs.passengers && <li><h3>Passengers</h3><span>{specs.passengers}</span></li>}
                {specs.cabins && <li><h3>Cabins</h3><span>{specs.cabins}</span></li>}


              </ul>
            </div>


            {boat.content.map(c => (<div class={'content-' + c.kind}>
              {c.kind == 'heading' && c.text && <h2>{c.text}</h2>}
              {c.kind == 'text' && c.text && c.text.split(/\n\n/).map(t => (<p>{t}</p>))}
              {c.kind == 'quote' && c.text && <blockquote>{c.text}</blockquote>}
              {c.kind == 'quote' && c.text && c.attribution && <b style={{ fontSize: '0.9rem' }}>— {c.attribution}</b>}
              {c.kind == 'quote' && <div style={{ display: 'flex', marginTop: '2rem' }}>
                <img onLoad={(ev) => (ev.target as any).style.opacity = 1.0} style={{ padding: '5px', borderRadius: '2px', transition: 'opacity 0.5s', opacity: '0', display: 'block', width: '33%', height: '200px', objectFit: 'cover' }} src={`${imagePath}c_scale,w_auto,dpr_auto,q_auto,fl_lossy,f_auto/c_limit,w_2000/${boat.media[0].info.public_id}`} />
                <img onLoad={(ev) => (ev.target as any).style.opacity = 1.0} style={{ padding: '5px', borderRadius: '2px', transition: 'opacity 0.5s', opacity: '0', display: 'block', width: '33%', height: '200px', objectFit: 'cover' }} src={`${imagePath}c_scale,w_auto,dpr_auto,q_auto,fl_lossy,f_auto/c_limit,w_2000/${boat.media[1].info.public_id}`} />
                <img onLoad={(ev) => (ev.target as any).style.opacity = 1.0} style={{ padding: '5px', borderRadius: '2px', transition: 'opacity 0.5s', opacity: '0', display: 'block', width: '33%', height: '200px', objectFit: 'cover' }} src={`${imagePath}c_scale,w_auto,dpr_auto,q_auto,fl_lossy,f_auto/c_limit,w_2000/${boat.media[2].info.public_id}`} />
              </div>}
            </div>))}
            <div class="pricing" style={{ overflow: 'auto', background: 'yellow' }}>
              <h2>Pricing</h2>
            </div>
            <div class="location" style={{ overflow: 'auto', background: 'yellow' }}>
              <h2>Location</h2>
            </div>
            <div class="contact" style={{ overflow: 'auto', background: 'yellow' }}>
              <h2>Contact</h2>
            </div>
            <div>
              <h2>Updates</h2>
              <p>There are no updates on this listing.</p>
            </div>
            <div>
              <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
              <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
              Testing Scroll
            </div>
          </main>
          <textarea value={JSON.stringify(this.boatData)}></textarea>
        </Host >
      );
    }
    else
      return (<Host>Loading...</Host>)
  }

}
