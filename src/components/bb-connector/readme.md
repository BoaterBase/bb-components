# bb-connector



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type     | Default |
| -------- | --------- | ----------- | -------- | ------- |
| `base`   | `base`    |             | `string` | `''`    |
| `mode`   | `mode`    |             | `string` | `''`    |
| `path`   | `path`    |             | `string` | `''`    |
| `root`   | `root`    |             | `string` | `''`    |


## Dependencies

### Depends on

- stencil-router
- stencil-route-switch
- stencil-route
- [bb-profile](../bb-profile)
- [bb-listing](../bb-listing)

### Graph
```mermaid
graph TD;
  bb-connector --> stencil-router
  bb-connector --> stencil-route-switch
  bb-connector --> stencil-route
  bb-connector --> bb-profile
  bb-connector --> bb-listing
  bb-profile --> bb-listing-card
  bb-listing --> ion-icon
  style bb-connector fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
