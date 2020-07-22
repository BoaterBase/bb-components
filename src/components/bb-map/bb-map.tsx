import { Component, ComponentInterface, Host, Prop, h } from '@stencil/core';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

@Component({
  tag: 'bb-map',
  styleUrl: 'bb-map.css',
  shadow: true,
})
export class BbMap implements ComponentInterface {
  @Prop() latitude: number = 0;
  @Prop() longitude: number = 0;

  loadMap = (el) => {
    console.log('GEO', el);
    //el => this.geoContainer = el as HTMLDivElement

    mapboxgl.accessToken = 'pk.eyJ1Ijoic2F5aXRyaWdodCIsImEiOiJjaXVmbjFsdzQwMGUyMnpud245ZjE4cmd3In0.lG2o6rH-9IRQY2eE2ktOiQ';
    //const _map = new mapboxgl.Map({
    //  container: el,
    //  style: 'mapbox://styles/mapbox/streets-v11'
    //});
    var map = new mapboxgl.Map({
      container: el, // container id
      style: 'mapbox://styles/sayitright/ckcwaxgwl030u1iqb6b7m7b45',//'mapbox://styles/mapbox/streets-v11',
      center: [this.longitude, this.latitude], // starting position [lng,lat]
      zoom: 9, // starting zoom
      scrollZoom: false
    });

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());
    const marker = new mapboxgl.Marker()
      .setLngLat([this.longitude, this.latitude])
      .setPopup(new mapboxgl.Popup().setHTML(`<small>${this.latitude},${this.longitude}</small>`))
      .addTo(map);
    marker;
    setTimeout(() => {
      map.resize();
    }, 500)
  }

  render() {
    //
    return (
      <Host>
        <link href='https://api.mapbox.com/mapbox-gl-js/v1.11.1/mapbox-gl.css' rel='stylesheet' />
        <div ref={this.loadMap} style={{ display: 'block', position: 'absolute', width: '100%', height: '100%' }}></div>
      </Host>
    );
  }

}
