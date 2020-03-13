import { Injectable } from '@angular/core';
import { Connectivity } from './ionic.provider';
import { Geolocation } from '@ionic-native/geolocation';
import { GOOGLE_MAP_API_KEY } from '../../app/base.url';
declare var google;

/*
Find tutorial here
 https://www.joshmorony.com/location-select-page-with-google-maps-and-ionic/
*/

@Injectable()
export class GoogleMaps {

  mapElement: any;
  pleaseConnect: any;
  map: any;
  mapInitialised: boolean = false;
  mapLoaded: any;
  mapLoadedObserver: any;
  currentMarker: any;
  apiKey: string = GOOGLE_MAP_API_KEY;
  location_details: any;

  constructor(
    public connectivityService: Connectivity,
    public geolocation: Geolocation) {

  }

  init(mapElement: any, pleaseConnect: any, coords?: number[], location_details?): Promise<any> {

    this.mapElement = mapElement;
    this.pleaseConnect = pleaseConnect;
    this.location_details = location_details;
    return this.loadGoogleMaps(coords);

  }

  loadGoogleMaps(coords?: number[]): Promise<any> {

    return new Promise((resolve) => {

      if (typeof google == "undefined" || typeof google.maps == "undefined") {

        console.log("Google maps JavaScript needs to be loaded.");
        this.disableMap();

        if (this.connectivityService.isOnline()) {

          window['mapInit'] = () => {

            this.initMap(coords).then(() => {
              resolve(true);
            });

            this.enableMap();
          }

          let script = document.createElement("script");
          script.id = "googleMaps";

          if (this.apiKey) {
            script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit&libraries=places';
          } else {
            script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
          }

          document.body.appendChild(script);

        }
      } else {

        if (this.connectivityService.isOnline()) {
          this.initMap(coords);
          this.enableMap();
        }
        else {
          this.disableMap();
        }

        resolve(true);

      }

      this.addConnectivityListeners();

    });

  }

  initMap(coords?: number[]): Promise<any> {

    this.mapInitialised = true;

    return new Promise((resolve) => {
      let latLng;
      this.geolocation.getCurrentPosition().then((position) => {
        if (coords) {
          latLng = new google.maps.LatLng(coords[0], coords[1]);
        } else {
          latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        }

        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }


        this.map = new google.maps.Map(this.mapElement, mapOptions);
        this.addMarker();
        resolve(true);

      });

    });

  }

  addMarker() {

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
    let content = '<h5 class="info-window">'+this.location_details ? this.location_details.name : 'Current Location'+'</h5>';
    this.addInfoWindow(marker, content);
  }

  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }

  disableMap(): void {

    if (this.pleaseConnect) {
      this.pleaseConnect.style.display = "block";
    }

  }

  enableMap(): void {

    if (this.pleaseConnect) {
      this.pleaseConnect.style.display = "none";
    }

  }

  addConnectivityListeners(): void {

    this.connectivityService.watchOnline().subscribe(() => {

      setTimeout(() => {

        if (typeof google == "undefined" || typeof google.maps == "undefined") {
          this.loadGoogleMaps();
        }
        else {
          if (!this.mapInitialised) {
            this.initMap();
          }

          this.enableMap();
        }

      }, 2000);

    });

    this.connectivityService.watchOffline().subscribe(() => {

      this.disableMap();

    });

  }

}