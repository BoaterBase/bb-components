import { Component, Host, State, h } from '@stencil/core';
import FireStoreParser from 'firestore-parser';

const apiPath = `https://firestore.googleapis.com/v1/projects/boaterbase-v2/databases/(default)/`
const imagePath = `https://res.cloudinary.com/boaterbase/image/upload/`;

@Component({
  tag: 'bb-collection',
  styleUrl: 'bb-collection.css',
  shadow: true
})
export class BbCollection {
  @State() collection: any;
  @State() loaded: boolean = false;

  @State() search: string = '';

  async componentWillLoad() {
    this.collection = await fetch(apiPath + 'documents/listings').then((r) => r.json()).then(json => FireStoreParser(json));
    this.loaded = true;
  }

  searchHandler = (ev: InputEvent) => {
    var el = ev.target as HTMLInputElement;
    this.search = el.value;
  }

  render() {
    if (this.loaded && this.collection && this.collection.documents) {
      let boats = this.collection.documents.filter(({ fields }) => fields.title.toLowerCase().indexOf(this.search) != -1);

      boats = [...boats, ...boats, ...boats]
      return (
        <Host>
          <h1>Featured Boats</h1>
          <form>
            <input type="search" placeholder="Search" value={this.search} onInput={this.searchHandler}></input>
          </form>
          <ul>
            {boats.map(({ name, fields }) => (<li key={name}>
              <div style={{ padding: '0.5rem' }}>
                {fields.media && <img onClick={() => { this.loaded = false }} onLoad={(ev) => (ev.target as any).style.opacity = 1.0} style={{ transition: 'opacity 0.5s', opacity: '0', backgroundColor: fields.media[0].info.colors ? fields.media[0].info.colors[0].color : 'black', display: 'block', width: '100%' }} sizes="100vw" src={`${imagePath}c_scale,w_auto,dpr_auto,q_auto,fl_lossy,f_auto/c_limit,w_800/${fields.media[0].info.public_id}`} />}

                <h3>{fields.title}</h3>
              </div>
            </li>))}
          </ul>
        </Host>
      );
    }
    else
      return (<Host></Host>)
  }

}
