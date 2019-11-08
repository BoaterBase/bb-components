import { Component, Host, Prop, State, h } from '@stencil/core';
import { fb } from '../../utils/utils';
import { firestore } from 'firebase';
import { cdnAsset, formatCurrency } from '../../utils/utils';

@Component({
  tag: 'bb-listing',
  styleUrl: 'bb-listing.css',
  shadow: true
})
export class BbListing {
  @Prop() listingPath: string;
  @Prop() history: any;

  @State() listingSnaphot: firestore.DocumentSnapshot;

  @State() overlay: { kind: string, selected?: number } = {
    kind: '',
    selected: 0,
  };

  get listingId() {
    // Allow for pretty urls where the id is at the end
    return this.listingPath.split('-').pop();
  }


  async componentDidLoad() {
    // Handles is a list so we must do a query and grab the first item
    this.listingSnaphot = await fb.firestore().collection('listings').doc(this.listingId).get();
  }

  render() {
    console.log(this.listingSnaphot)
    if (!this.listingSnaphot)
      return <Host>Loading...</Host>
    if (!this.listingSnaphot.exists)
      return <Host>Missing</Host>


    const listing = this.listingSnaphot.data();
    const specs = listing.specifications || {};
    const media = listing.media || [];
    const content = listing.content || [];

    const primaryMedia = listing.media[0];

    const selectedMedia = this.overlay && listing.media[this.overlay.selected];

    const primaryVariant = listing.variants && listing.variants[0];

    const shortTitle = ([specs.year, specs.manufacturer, specs.model]).filter(Boolean);

    return (
      <Host>
        <div>

          <div class="heading-container">
            <div class="large-heading" style={{ margin: '1rem', flex: '1', flexDirection: 'column', alignItems: 'center' }}>
              <button style={{ margin: '1rem', appearance: 'none', borderRadius: '100%', border: '1px solid #eee', background: 'white', padding: '0' }}>
                <img style={{ borderRadius: '100%', width: '8rem', height: '8rem' }} src="https://gravatar.com/avatar/b6de1b5951e1ab139a39968f907c4f77?d=mp" />
              </button>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '500', margin: '0.25rem' }}>{shortTitle.join(' · ')}</h2>
              {listing.location && <div style={{ marginBottom: '1rem', display: 'flex', fontSize: '0.9rem', fontWeight: '500', opacity: '0.5' }}><ion-icon name="pin" style={{ opacity: '0.25' }}></ion-icon>{listing.location}</div>}
              <div style={{ flex: 'auto' }}></div>
              {listing.message && <strong style={{ fontWeight: '500', color: 'red', letterSpacing: '-0.05rem', fontSize: '0.75rem', textTransform: 'uppercase' }}>{listing.message}</strong>}

              {primaryVariant && primaryVariant.amount != 0 && <strong style={{ fontSize: '1.5rem', fontWeight: '600' }}>{formatCurrency(primaryVariant.amount, primaryVariant.currency)}</strong>}

              <button onClick={() => this.overlay = { kind: 'contact' }} style={{ appearance: 'none', outline: 'none', margin: '1rem', fontSize: '1rem', background: 'white', borderRadius: '2rem', padding: '0.5rem 1.5rem', color: '#666', border: '1px solid #eee' }}>Contact{listing.profile && listing.profile.data && listing.profile.data.name && ` ${listing.profile.data.name}`}</button>
            </div>
            <div class="small-heading" style={{ margin: '0 1rem' }}>
              <div style={{ fontWeight: '600' }}>{shortTitle.join(' · ')}</div>
              <div style={{ color: 'inherit', opacity: '0.5', fontWeight: '400' }}>{listing.location}</div>
            </div>

            {primaryMedia && <div onClick={() => this.overlay = { kind: 'media', selected: 0 }} style={{ flex: '1.5', margin: '1rem' }}>
              {primaryMedia.info.resource_type == 'image' && <img class="hover-zoom" style={{ boxShadow: '0 0 1rem rgba(25,50,100,0.2)', borderRadius: '0.5rem', display: 'block', margin: 'auto', maxWidth: '100%', maxHeight: '80vh' }} src={cdnAsset(primaryMedia.info, 'jpg', 't_large_image')} />}
              {primaryMedia.info.resource_type == 'video' && <video class="hover-zoom" style={{ boxShadow: '0 0 1rem rgba(25,50,100,0.2)', borderRadius: '0.5rem', display: 'block', margin: 'auto', maxWidth: '100%', maxHeight: '80vh' }} poster={cdnAsset(primaryMedia.info, 'jpg', 't_large_image')} controls>
                <source src={cdnAsset(primaryMedia.info, 'm3u8', 't_streaming_video')} type="application/x-mpegURL" />
                <source src={cdnAsset(primaryMedia.info, 'mp4', 't_progressive_video')} type="video/mp4" />
                {/*                    
                    <source src={cdnAsset(m.info, 'mpd', 't_streaming_video')} type="application/dash+xml" />
                    <source src={cdnAsset(m.info, 'webm', 't_progressive_video')} type="video/webm" />
                    <source src={cdnAsset(m.info, 'ogv', 't_progressive_video')} type="video/ogg" />
                    */}
              </video>}
            </div>}
          </div>

          <div style={{ margin: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', margin: '0.5rem 0' }}>{listing.title}</h1>
            <p style={{ margin: '1rem 0', maxWidth: '50rem', opacity: '0.5', fontSize: '1.25rem', fontFamily: 'serif', fontStyle: 'italic' }}>{listing.summary}</p>
          </div>

          <div style={{}}>
            <ul class="specs">
              {specs.category && <li><h3>Category</h3><span>{specs.category}</span></li>}
              {specs.classification && <li><h3>Classification</h3><span>{specs.classification}</span></li>}

              {specs.manufacturer && <li><h3>Manufacturer</h3><span>{specs.manufacturer}</span></li>}
              {specs.model && <li><h3>Model</h3><span>{specs.model}</span></li>}

              {specs.designer && <li><h3>Designer</h3><span>{specs.designer}</span></li>}
              {specs.builder && <li><h3>Builder</h3><span>{specs.builder}</span></li>}

              {specs.loa ? <li><h3>Length Overall</h3><span>{specs.loa.toFixed(2)} <small>m</small></span></li> : null}
              {specs.lwl ? <li><h3>Length At Waterline</h3><span>{specs.lwl.toFixed(2)} <small>m</small></span></li> : null}

              {specs.beam ? <li><h3>Beam</h3><span>{specs.beam.toFixed(2)} <small>m</small></span></li> : null}
              {specs.draft ? <li><h3>Draft</h3><span>{specs.draft.toFixed(2)} <small>m</small></span></li> : null}

              {specs.hoa ? <li><h3>Height Above Waterline</h3><span>{specs.haw.toFixed(2)} <small>m</small></span></li> : null}

              {specs.profile && <li><h3>Profile</h3><span>{specs.profile}</span></li>}
              {specs.material && <li><h3>Material</h3><span>{specs.material}</span></li>}


              {specs.displacement ? <li><h3>Displacement</h3><span>{specs.displacement.toFixed(2)} <small>kg</small></span></li> : null}
              {specs.weight ? <li><h3>Weight</h3><span>{specs.weight.toFixed(2)} <small>kg</small></span></li> : null}


              {specs.propulsion && <li><h3>Propulsion</h3><span>{specs.propulsion}</span></li>}
              {specs.engines ? <li><h3>Engines</h3><span>{specs.engines}</span></li> : null}

              {specs.power ? <li><h3>Engine Power</h3><span>{specs.power.toFixed(2)} <small>kw</small></span></li> : null}

              {specs.fuelcapacity ? <li><h3>Fuel Capacity</h3><span>{specs.fuelcapacity.toFixed(2)} <small>l</small></span></li> : null}
              {specs.watercapacity ? <li><h3>Water Capacity</h3><span>{specs.watercapacity.toFixed(2)} <small>l</small></span></li> : null}

              {specs.berths ? <li><h3>Berths</h3><span>{specs.berths}</span></li> : null}
              {specs.cabins ? <li><h3>Cabins</h3><span>{specs.cabins}</span></li> : null}


              {specs.certification && <li><h3>Certification</h3><span>{specs.certification}</span></li>}
              {specs.hullid && <li><h3>Hull Id</h3><span>{specs.hullid}</span></li>}
              {specs.registry && <li><h3>Registery</h3><span>{specs.registry}</span></li>}
              {specs.name && <li><h3>Name</h3><span>{specs.name}</span></li>}

            </ul>
          </div>
          <div style={{ margin: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ flex: 'none', display: 'flex', flexWrap: 'wrap' }}>
              {media.map((m, i) => (<img class="hover-zoom" onClick={() => { this.overlay = { kind: 'media', selected: i } }} style={{ borderRadius: '3px', flex: 'none', objectFit: 'cover', width: '23%', margin: '1%' }} src={m.info.thumbnail_url} />))}
            </div>
          </div>
          <div style={{ margin: '2rem', fontSize: '1rem', lineHeight: '1.4rem' }}>
            {content.map(({ kind, text }) => <div>
              {kind == 'text' && text.split(/[\r?\n|\r]\s*[\r?\n|\r]/).map(p => <p>{p}</p>)}
            </div>)}
          </div>

        </div>
        {this.overlay && this.overlay.kind == 'contact' && <div onClick={() => { this.overlay = null }} style={{ position: 'fixed', zIndex: '999999', top: '0', left: '0', width: '100%', height: '100%', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(5px)' }}>
          <form style={{ display: 'flex' }}>
            <input name="a" type="hidden" value={Date.now()}></input>
            <input name="b" type="hidden" value={Date.now()}></input>
            <input name="c" type="hidden"></input>
            <div>
              <input style={{ display: 'block' }} placeholder="Name"></input>
              <input style={{ display: 'block' }} placeholder="Email"></input>
              <input style={{ display: 'block' }} placeholder="Telephone"></input>
            </div>
            <div>
              <textarea style={{ display: 'block' }} placeholder="Message"></textarea>
              <button style={{ display: 'block' }} type="submit">Send Message</button>
            </div>
          </form>
        </div>}
        {this.overlay && this.overlay.kind == 'media' && <div id="mediaOverlay" style={{ position: 'fixed', zIndex: '999999', top: '0', left: '0', width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(15px)' }}>
          <div style={{ position: 'absolute', bottom: '0', width: '100%', height: '58px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ flex: 'none', display: 'flex', overflowX: 'auto' }}>
              {media.map((m, i) => (<img class="gallery-thumb" onClick={() => { this.overlay = { kind: 'media', selected: i } }} style={{ cursor: 'pointer', borderRadius: '3px', margin: '2px', flex: 'none', objectFit: 'cover', width: '52px', height: '52px' }} src={m.info.thumbnail_url} />))}
            </div>
          </div>
          <div key={this.overlay.selected} style={{ position: 'absolute', left: '0', width: '100%', top: '60px', bottom: '60px', padding: '0 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {selectedMedia.info.resource_type == 'image' && <img onLoad={(ev) => (ev.target as HTMLElement).style.opacity = '1.0'} style={{ opacity: '0', transition: 'opacity 0.5s', borderRadius: '3px', boxShadow: '0 0 20px rgba(0,0,0,0.5)', display: 'block', margin: 'auto', maxWidth: '100%', maxHeight: '100%' }} src={cdnAsset(selectedMedia.info, 'jpg', 't_large_image')} />}
            {selectedMedia.info.resource_type == 'video' && <video onLoad={(ev) => (ev.target as HTMLElement).style.opacity = '1.0'} style={{ opacity: '0', transition: 'opacity 0.5s', borderRadius: '3px', boxShadow: '0 0 20px rgba(0,0,0,0.5)', display: 'block', margin: 'auto', maxWidth: '100%', maxHeight: '100%' }} autoplay poster={cdnAsset(selectedMedia.info, 'jpg', 't_large_image')} controls>
              <source src={cdnAsset(selectedMedia.info, 'm3u8', 't_streaming_video')} type="application/x-mpegURL" />
              <source src={cdnAsset(selectedMedia.info, 'mp4', 't_progressive_video')} type="video/mp4" />
              {/*                    
      <source src={cdnAsset(m.info, 'mpd', 't_streaming_video')} type="application/dash+xml" />
      <source src={cdnAsset(m.info, 'webm', 't_progressive_video')} type="video/webm" />
      <source src={cdnAsset(m.info, 'ogv', 't_progressive_video')} type="video/ogg" />
      */}
            </video>}
          </div>

          <button onClick={() => this.overlay = null} style={{ cursor: 'pointer', position: 'absolute', top: '3px', right: '3px', padding: '9px', borderRadius: '3px', appearance: 'none', border: 'none', background: 'rgba(0,0,0,0.1)', color: 'white' }}>
            <ion-icon name="close" size="large"></ion-icon>
          </button>
          <div style={{ position: 'absolute', top: '5px', height: '50px', left: '60px', right: '60px', color: 'white', opacity: '0.9', display: 'block', textOverflow: 'ellipsis', fontWeight: '300', lineHeight: '16px', fontSize: '14px', textAlign: 'center', overflow: 'hidden', lineClamp: '3' }}>{selectedMedia.description}</div>
        </div>}

      </Host>
    );

  }

}
