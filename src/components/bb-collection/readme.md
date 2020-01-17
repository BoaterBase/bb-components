# bb-collection



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute           | Description | Type                             | Default     |
| ------------------ | ------------------- | ----------- | -------------------------------- | ----------- |
| `collectionHeader` | `collection-header` |             | `"image" \| "none" \| "overlay"` | `'overlay'` |
| `collectionPath`   | `collection-path`   |             | `string`                         | `undefined` |
| `root`             | `root`              |             | `string`                         | `'/'`       |


## Dependencies

### Used by

 - [bb-connector](../bb-connector)

### Depends on

- ion-icon
- [bb-listing-card](../bb-listing-card)

### Graph
```mermaid
graph TD;
  bb-collection --> ion-icon
  bb-collection --> bb-listing-card
  bb-listing-card --> ion-icon
  bb-connector --> bb-collection
  style bb-collection fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
