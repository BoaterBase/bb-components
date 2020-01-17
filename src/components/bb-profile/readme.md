# bb-profile



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute        | Description | Type                             | Default     |
| --------------- | ---------------- | ----------- | -------------------------------- | ----------- |
| `profileHeader` | `profile-header` |             | `"image" \| "none" \| "overlay"` | `'overlay'` |
| `profilePath`   | `profile-path`   |             | `string`                         | `undefined` |
| `root`          | `root`           |             | `string`                         | `'/'`       |


## Events

| Event       | Description | Type               |
| ----------- | ----------- | ------------------ |
| `linkClick` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [bb-connector](../bb-connector)

### Depends on

- [bb-listing-card](../bb-listing-card)

### Graph
```mermaid
graph TD;
  bb-profile --> bb-listing-card
  bb-listing-card --> ion-icon
  bb-connector --> bb-profile
  style bb-profile fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
