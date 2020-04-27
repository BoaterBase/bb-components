# bb-connector



<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute                    | Description                                    | Type                             | Default                |
| -------------------------- | ---------------------------- | ---------------------------------------------- | -------------------------------- | ---------------------- |
| `collectionFilters`        | `collection-filters`         |                                                | `string`                         | `'manufacturer,model'` |
| `collectionHeader`         | `collection-header`          | Collection header layout .                     | `"image" \| "none" \| "overlay"` | `'overlay'`            |
| `collectionList`           | `collection-list`            | Collection list layout .                       | `"card" \| "overlay"`            | `'overlay'`            |
| `collectionLocationFilter` | `collection-location-filter` |                                                | `string`                         | `'All Locations'`      |
| `collectionProfileFilter`  | `collection-profile-filter`  |                                                | `string`                         | `'All Profiles'`       |
| `path`                     | `path`                       | The path of the component you want to display. | `string`                         | `undefined`            |
| `profileHeader`            | `profile-header`             | Profile header layout .                        | `"image" \| "none" \| "overlay"` | `'overlay'`            |
| `root`                     | `root`                       | The root for mapping urls e.g. listing/id .    | `string`                         | `'#/'`                 |


## Dependencies

### Depends on

- stencil-router
- stencil-route-switch
- stencil-route
- [bb-listing](../bb-listing)
- [bb-profile](../bb-profile)
- [bb-collection](../bb-collection)

### Graph
```mermaid
graph TD;
  bb-connector --> stencil-router
  bb-connector --> stencil-route-switch
  bb-connector --> stencil-route
  bb-connector --> bb-listing
  bb-connector --> bb-profile
  bb-connector --> bb-collection
  bb-listing --> bb-icon
  bb-listing --> bb-content
  bb-content --> bb-media
  bb-profile --> bb-listing-card
  bb-profile --> bb-icon
  bb-listing-card --> bb-icon
  bb-collection --> bb-listing-card
  style bb-connector fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
