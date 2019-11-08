import { Component, Host, Prop, h } from '@stencil/core';
import '@stencil/router';

@Component({
  tag: 'bb-connector',
  styleUrl: 'bb-connector.css',
  shadow: true
})
export class BbConnector {
  @Prop() base: string = '';
  @Prop() path: string = '';
  @Prop() root: string = '';
  @Prop() mode: string = '';

  get isPathValid() {
    return !!this.path;
  }

  get isRootValid() {
    return !this.root.endsWith('/');
  }

  get isBaseValid() {
    return ['listing', 'collection', 'profile'].includes(this.base);
  }

  historyHelper(history) {
    return {
      link: (path) => this.mode == 'hash' ? '#' + this.root + path : this.root + path,
      forward: (path) => history.push(this.root + path),
      back: (path) => history.pop(this.root + path)
    }
  }

  render() {
    return (
      <Host>
        <stencil-router historyType={this.mode == 'hash' ? 'hash' : 'browser'}>
          {
            this.isRootValid && this.isPathValid && this.base == 'listing' && <stencil-route-switch scrollTopOffset={0}>
              <stencil-route url={this.root + '/'} exact={true} routeRender={() => (<div>Listing {this.path}</div>)}></stencil-route>
              <stencil-route url={this.root + '/updates/:updateId'} exact={true} routeRender={(props) => (<div>Listing Update {this.path} {props.match.params.updateId}</div>)}></stencil-route>
              <stencil-route routeRender={() => (<div>404 - Listing</div>)}></stencil-route>
            </stencil-route-switch>
          }

          {
            this.isRootValid && this.isPathValid && this.base == 'profile' && <stencil-route-switch scrollTopOffset={0}>
              <stencil-route url={this.root + '/'} exact={true} routeRender={(props) => <bb-profile profileHandle={this.path} history={this.historyHelper(props.history)}></bb-profile>}></stencil-route>
              <stencil-route url={this.root + '/listings/:listingId'} exact={true} routeRender={(props) => (<div>Profile/Listing {this.path} {props.match.params.listingId}</div>)}></stencil-route>

              <stencil-route url={this.root + '/updates/:updateId'} exact={true} routeRender={(props) => (<div>Profile/Update {this.path} {props.match.params.updateId}</div>)}></stencil-route>
              <stencil-route url={this.root + '/collections/:collectionId'} exact={true} routeRender={(props) => (<div>Profile/Collection {this.path} {props.match.params.collectionId}</div>)}></stencil-route>
              <stencil-route url={this.root + '/collections/:collectionId/listings/:listingId'} exact={true} routeRender={(props) => (<div>Profile/Collection/Listing {this.path} {props.match.params.collectionId}</div>)}></stencil-route>
              <stencil-route url={this.root + '/collections/:collectionId/listings/:listingId/updates/:updateId'} exact={true} routeRender={(props) => (<div>Profile/Collection/Listing/Update {this.path} {props.match.params.collectionId}</div>)}></stencil-route>
              <stencil-route routeRender={() => (<div>404 - Profile</div>)}></stencil-route>
            </stencil-route-switch>
          }

          {
            this.isRootValid && this.isPathValid && this.base == 'collection' && <stencil-route-switch scrollTopOffset={0}>
              <stencil-route url={this.root + '/'} exact={true} routeRender={() => (<div>Collection {this.path}</div>)}></stencil-route>
              <stencil-route url={this.root + '/listings/:listingId'} exact={true} routeRender={(props) => (<div>Collection/Listing {this.path} {props.match.params.collectionId}</div>)}></stencil-route>
              <stencil-route url={this.root + '/listings/:listingId/updates/:updateId'} exact={true} routeRender={(props) => (<div>Collection/Listing/Update {this.path} {props.match.params.collectionId}</div>)}></stencil-route>
              <stencil-route routeRender={() => (<div>404 - Collection</div>)}></stencil-route>
            </stencil-route-switch>
          }
          {
            !this.isRootValid || !this.isPathValid || !this.isBaseValid && <stencil-route-switch scrollTopOffset={0}>
              <stencil-route routeRender={() => (<div>400</div>)}></stencil-route>
            </stencil-route-switch>
          }
        </stencil-router>
      </Host>
    );
  }
}
