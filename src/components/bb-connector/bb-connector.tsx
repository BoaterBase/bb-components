import { Component, Host, Prop, Listen, h } from '@stencil/core';
import { RouterHistory } from '@stencil/router';

import '@stencil/router';

@Component({
  tag: 'bb-connector',
  styleUrl: 'bb-connector.css',
  shadow: true
})
export class BbConnector {
  /**
   * The path of the component you want to display.
   */
  @Prop() path: string;
  /**
   * The root for mapping urls e.g. listing/id .
   */
  @Prop() root: string = '#/';

  /**
   * Profile header layout .
   */
  @Prop() profileHeader: 'none' | 'overlay' | 'image' = 'overlay';

  /**
   * Collection header layout .
   */
  @Prop() collectionHeader: 'none' | 'overlay' | 'image' = 'overlay';

  // Hack for getting current history obect
  history: RouterHistory;

  get id() {
    return this.path.split('/')[1];
  }

  get base() {
    return this.path.split('/')[0].replace(/s+$/, '');
  }

  get isPathValid() {
    return !!this.path;
  }

  get isBaseValid() {
    return ['listing', 'collection', 'profile'].includes(this.base);
  }

  get routerRoot() {
    // Remove the leading # and trailing slash when building router paths
    return this.root.replace(/^\#/, '').replace(/\/$/, '');
  }

  @Listen('linkClick')
  async linkClickHandler(event: CustomEvent) {
    //console.log('Received the custom linkClickHandler event: ', event);

    event.preventDefault();
    this.history.push(this.routerRoot + '/' + event.detail.path);
  }

  render() {
    return (
      <Host>
        <stencil-router historyType={this.root.includes('#') ? 'hash' : 'browser'}>
          {
            this.isPathValid && this.base == 'listing' && <stencil-route-switch scrollTopOffset={0}>
              <stencil-route url={[this.routerRoot, this.routerRoot + '/']} exact={true} routeRender={() => (<div>Listing {this.path}</div>)}></stencil-route>
              <stencil-route url={this.routerRoot + '/updates/:updateId'} exact={true} routeRender={(props) => (<div>Listing Update {this.path} {props.match.params.updateId}</div>)}></stencil-route>
              <stencil-route routeRender={() => (<div>404 - Listing</div>)}></stencil-route>
            </stencil-route-switch>
          }

          {
            this.isPathValid && this.base == 'profile' && <stencil-route-switch scrollTopOffset={0}>
              <stencil-route url={[this.routerRoot, this.routerRoot + '/']} exact={true} routeRender={(props) => { this.history = props.history; return <bb-profile profilePath={this.id} root={this.root} profileHeader={this.profileHeader}></bb-profile> }}></stencil-route>
              <stencil-route url={this.routerRoot + '/listings/:listingId'} exact={true} routeRender={(props) => { this.history = props.history; return <bb-listing listingPath={props.match.params.listingId} root={this.root}></bb-listing> }}></stencil-route>
              <stencil-route url={this.routerRoot + '/collections/:collectionId'} exact={true} routeRender={(props) => { this.history = props.history; return <bb-collection collectionPath={props.match.params.collectionId} root={this.root} collectionHeader={this.collectionHeader}></bb-collection> }}></stencil-route>
              <stencil-route routeRender={() => (<div>404 - Profile</div>)}></stencil-route>
            </stencil-route-switch>
          }

          {
            this.isPathValid && this.base == 'collection' && <stencil-route-switch scrollTopOffset={0}>
              <stencil-route url={[this.routerRoot, this.routerRoot + '/']} exact={true} routeRender={(props) => { this.history = props.history; return <bb-collection collectionPath={this.id} root={this.root} collectionHeader={this.collectionHeader}></bb-collection> }}></stencil-route>
              <stencil-route url={this.routerRoot + '/listings/:listingId'} exact={true} routeRender={(props) => (<bb-listing listingPath={props.match.params.listingId} root={this.root}></bb-listing>)}></stencil-route>
              <stencil-route routeRender={() => (<div>404 - Collection</div>)}></stencil-route>
            </stencil-route-switch>
          }
          {
            !this.isPathValid || !this.isBaseValid && <stencil-route-switch scrollTopOffset={0}>
              <stencil-route routeRender={() => (<div>400</div>)}></stencil-route>
            </stencil-route-switch>
          }
        </stencil-router>
      </Host>
    );
  }
}
