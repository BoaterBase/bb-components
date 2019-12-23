# bb-connector



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                                          | Type                                     | Default     |
| -------- | --------- | ---------------------------------------------------- | ---------------------------------------- | ----------- |
| `base`   | `base`    | The base component type to start the routing from.   | `"collection" \| "listing" \| "profile"` | `undefined` |
| `mode`   | `mode`    | The history mode to use for navigation.              | `"browser" \| "hash"`                    | `'browser'` |
| `path`   | `path`    | The path or id of the base type you want to display. | `string`                                 | `undefined` |
| `root`   | `root`    | The root for mapping urls e.g. /custompath .         | `string`                                 | `''`        |


## Dependencies

### Depends on

- stencil-router
- stencil-route-switch
- stencil-route
- [bb-profile](../bb-profile)
- [bb-listing](../bb-listing)
- [bb-collection](../bb-collection)

### Graph
```mermaid
graph TD;
  bb-connector --> stencil-router
  bb-connector --> stencil-route-switch
  bb-connector --> stencil-route
  bb-connector --> bb-profile
  bb-connector --> bb-listing
  bb-connector --> bb-collection
  bb-profile --> bb-listing-card
  bb-listing --> ion-icon
  bb-collection --> ion-icon
  bb-collection --> bb-listing-card
  style bb-connector fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
