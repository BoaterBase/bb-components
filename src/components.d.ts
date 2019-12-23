/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';


export namespace Components {
  interface BbCollection {
    'collectionPath': string;
    'history': any;
  }
  interface BbConnector {
    /**
    * The base component type to start the routing from.
    */
    'base': 'profile' | 'listing' | 'collection';
    /**
    * The history mode to use for navigation.
    */
    'mode': 'hash' | 'browser';
    /**
    * The path or id of the base type you want to display.
    */
    'path': string;
    /**
    * The root for mapping urls e.g. /custompath .
    */
    'root': string;
  }
  interface BbContactForm {}
  interface BbListing {
    'history': any;
    'listingPath': string;
  }
  interface BbListingCard {
    'history': any;
    'listingData': any;
    'listingId': string;
  }
  interface BbProfile {
    'history': any;
    'profilePath': string;
  }
}

declare global {


  interface HTMLBbCollectionElement extends Components.BbCollection, HTMLStencilElement {}
  var HTMLBbCollectionElement: {
    prototype: HTMLBbCollectionElement;
    new (): HTMLBbCollectionElement;
  };

  interface HTMLBbConnectorElement extends Components.BbConnector, HTMLStencilElement {}
  var HTMLBbConnectorElement: {
    prototype: HTMLBbConnectorElement;
    new (): HTMLBbConnectorElement;
  };

  interface HTMLBbContactFormElement extends Components.BbContactForm, HTMLStencilElement {}
  var HTMLBbContactFormElement: {
    prototype: HTMLBbContactFormElement;
    new (): HTMLBbContactFormElement;
  };

  interface HTMLBbListingElement extends Components.BbListing, HTMLStencilElement {}
  var HTMLBbListingElement: {
    prototype: HTMLBbListingElement;
    new (): HTMLBbListingElement;
  };

  interface HTMLBbListingCardElement extends Components.BbListingCard, HTMLStencilElement {}
  var HTMLBbListingCardElement: {
    prototype: HTMLBbListingCardElement;
    new (): HTMLBbListingCardElement;
  };

  interface HTMLBbProfileElement extends Components.BbProfile, HTMLStencilElement {}
  var HTMLBbProfileElement: {
    prototype: HTMLBbProfileElement;
    new (): HTMLBbProfileElement;
  };
  interface HTMLElementTagNameMap {
    'bb-collection': HTMLBbCollectionElement;
    'bb-connector': HTMLBbConnectorElement;
    'bb-contact-form': HTMLBbContactFormElement;
    'bb-listing': HTMLBbListingElement;
    'bb-listing-card': HTMLBbListingCardElement;
    'bb-profile': HTMLBbProfileElement;
  }
}

declare namespace LocalJSX {
  interface BbCollection {
    'collectionPath'?: string;
    'history'?: any;
  }
  interface BbConnector {
    /**
    * The base component type to start the routing from.
    */
    'base'?: 'profile' | 'listing' | 'collection';
    /**
    * The history mode to use for navigation.
    */
    'mode'?: 'hash' | 'browser';
    /**
    * The path or id of the base type you want to display.
    */
    'path'?: string;
    /**
    * The root for mapping urls e.g. /custompath .
    */
    'root'?: string;
  }
  interface BbContactForm {}
  interface BbListing {
    'history'?: any;
    'listingPath'?: string;
  }
  interface BbListingCard {
    'history'?: any;
    'listingData'?: any;
    'listingId'?: string;
  }
  interface BbProfile {
    'history'?: any;
    'profilePath'?: string;
  }

  interface IntrinsicElements {
    'bb-collection': BbCollection;
    'bb-connector': BbConnector;
    'bb-contact-form': BbContactForm;
    'bb-listing': BbListing;
    'bb-listing-card': BbListingCard;
    'bb-profile': BbProfile;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      'bb-collection': LocalJSX.BbCollection & JSXBase.HTMLAttributes<HTMLBbCollectionElement>;
      'bb-connector': LocalJSX.BbConnector & JSXBase.HTMLAttributes<HTMLBbConnectorElement>;
      'bb-contact-form': LocalJSX.BbContactForm & JSXBase.HTMLAttributes<HTMLBbContactFormElement>;
      'bb-listing': LocalJSX.BbListing & JSXBase.HTMLAttributes<HTMLBbListingElement>;
      'bb-listing-card': LocalJSX.BbListingCard & JSXBase.HTMLAttributes<HTMLBbListingCardElement>;
      'bb-profile': LocalJSX.BbProfile & JSXBase.HTMLAttributes<HTMLBbProfileElement>;
    }
  }
}


