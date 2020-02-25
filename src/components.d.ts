/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';


export namespace Components {
  interface BbCollection {
    'collectionFilters': string;
    'collectionHeader': 'none' | 'overlay' | 'image';
    'collectionList': 'card' | 'overlay';
    'collectionLocationFilter': string;
    'collectionPath': string;
    'collectionProfileFilter': string;
    'root': string;
  }
  interface BbConnector {
    'collectionFilters': string;
    /**
    * Collection header layout .
    */
    'collectionHeader': 'none' | 'overlay' | 'image';
    /**
    * Collection list layout .
    */
    'collectionList': 'card' | 'overlay';
    'collectionLocationFilter': string;
    'collectionProfileFilter': string;
    /**
    * The path of the component you want to display.
    */
    'path': string;
    /**
    * Profile header layout .
    */
    'profileHeader': 'none' | 'overlay' | 'image';
    /**
    * The root for mapping urls e.g. listing/id .
    */
    'root': string;
  }
  interface BbContactForm {}
  interface BbContent {
    'content': any[];
  }
  interface BbIcon {
    'color': string;
    'icon': string;
    'size': string;
  }
  interface BbListing {
    'listingPath': string;
    'root': string;
  }
  interface BbListingCard {
    'display': 'card' | 'list' | 'overlay';
    'listingData': any;
    'listingId': string;
    'root': string;
  }
  interface BbMedia {
    'display': string;
    'items': any[];
  }
  interface BbProfile {
    'profileHeader': 'none' | 'overlay' | 'image';
    'profilePath': string;
    'root': string;
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

  interface HTMLBbContentElement extends Components.BbContent, HTMLStencilElement {}
  var HTMLBbContentElement: {
    prototype: HTMLBbContentElement;
    new (): HTMLBbContentElement;
  };

  interface HTMLBbIconElement extends Components.BbIcon, HTMLStencilElement {}
  var HTMLBbIconElement: {
    prototype: HTMLBbIconElement;
    new (): HTMLBbIconElement;
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

  interface HTMLBbMediaElement extends Components.BbMedia, HTMLStencilElement {}
  var HTMLBbMediaElement: {
    prototype: HTMLBbMediaElement;
    new (): HTMLBbMediaElement;
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
    'bb-content': HTMLBbContentElement;
    'bb-icon': HTMLBbIconElement;
    'bb-listing': HTMLBbListingElement;
    'bb-listing-card': HTMLBbListingCardElement;
    'bb-media': HTMLBbMediaElement;
    'bb-profile': HTMLBbProfileElement;
  }
}

declare namespace LocalJSX {
  interface BbCollection {
    'collectionFilters'?: string;
    'collectionHeader'?: 'none' | 'overlay' | 'image';
    'collectionList'?: 'card' | 'overlay';
    'collectionLocationFilter'?: string;
    'collectionPath'?: string;
    'collectionProfileFilter'?: string;
    'root'?: string;
  }
  interface BbConnector {
    'collectionFilters'?: string;
    /**
    * Collection header layout .
    */
    'collectionHeader'?: 'none' | 'overlay' | 'image';
    /**
    * Collection list layout .
    */
    'collectionList'?: 'card' | 'overlay';
    'collectionLocationFilter'?: string;
    'collectionProfileFilter'?: string;
    /**
    * The path of the component you want to display.
    */
    'path'?: string;
    /**
    * Profile header layout .
    */
    'profileHeader'?: 'none' | 'overlay' | 'image';
    /**
    * The root for mapping urls e.g. listing/id .
    */
    'root'?: string;
  }
  interface BbContactForm {}
  interface BbContent {
    'content'?: any[];
  }
  interface BbIcon {
    'color'?: string;
    'icon'?: string;
    'size'?: string;
  }
  interface BbListing {
    'listingPath'?: string;
    'root'?: string;
  }
  interface BbListingCard {
    'display'?: 'card' | 'list' | 'overlay';
    'listingData'?: any;
    'listingId'?: string;
    'onLinkClick'?: (event: CustomEvent<any>) => void;
    'root'?: string;
  }
  interface BbMedia {
    'display'?: string;
    'items'?: any[];
  }
  interface BbProfile {
    'onLinkClick'?: (event: CustomEvent<any>) => void;
    'profileHeader'?: 'none' | 'overlay' | 'image';
    'profilePath'?: string;
    'root'?: string;
  }

  interface IntrinsicElements {
    'bb-collection': BbCollection;
    'bb-connector': BbConnector;
    'bb-contact-form': BbContactForm;
    'bb-content': BbContent;
    'bb-icon': BbIcon;
    'bb-listing': BbListing;
    'bb-listing-card': BbListingCard;
    'bb-media': BbMedia;
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
      'bb-content': LocalJSX.BbContent & JSXBase.HTMLAttributes<HTMLBbContentElement>;
      'bb-icon': LocalJSX.BbIcon & JSXBase.HTMLAttributes<HTMLBbIconElement>;
      'bb-listing': LocalJSX.BbListing & JSXBase.HTMLAttributes<HTMLBbListingElement>;
      'bb-listing-card': LocalJSX.BbListingCard & JSXBase.HTMLAttributes<HTMLBbListingCardElement>;
      'bb-media': LocalJSX.BbMedia & JSXBase.HTMLAttributes<HTMLBbMediaElement>;
      'bb-profile': LocalJSX.BbProfile & JSXBase.HTMLAttributes<HTMLBbProfileElement>;
    }
  }
}


