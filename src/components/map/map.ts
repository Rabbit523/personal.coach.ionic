import { NavController, Platform, ViewController, NavParams } from 'ionic-angular';
import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '../../shared/index';
import { Gym } from '../../pages/index';
declare var google;

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class Map {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

  latitude: number;
  longitude: number;
  autocompleteService: any;
  placesService: any;
  query: string = '';
  places: any = [];
  searchDisabled: boolean;
  saveDisabled: boolean;
  location: any;
  markers = [];
  place: any;

  constructor(
    public navCtrl: NavController,
    public zone: NgZone,
    public maps: GoogleMaps,
    public platform: Platform,
    public geolocation: Geolocation,
    public viewCtrl: ViewController,
    private navParams: NavParams
    ) {
    this.searchDisabled = true;
    this.saveDisabled = true;
  }

  ionViewDidLoad(): void {
    let coords = this.navParams.get('coords');
    let location_details = this.navParams.get('location');
    this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement, coords, location_details).then((result) => {
      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.placesService = new google.maps.places.PlacesService(this.maps.map);
      this.searchDisabled = false;
    });
  }

  selectPlace(place) {
    this.places = [];
    let location = {
      lat: null,
      lng: null,
      name: place.name
    };
    this.placesService.getDetails({ placeId: place.place_id }, (details) => {
      this.zone.run(() => {
        location.name = details.name;
        location.lat = details.geometry.location.lat();
        location.lng = details.geometry.location.lng();
        this.saveDisabled = false;
        this.maps.map.setCenter({ lat: location.lat, lng: location.lng });
        this.location = location;
        this.createMapMarker(details);
      });
    });
  }

  createMapMarker(place: any): void {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: this.maps.map,
      position: placeLoc
    });
    this.place = place;
    this.markers.push(marker);
    let content = '<h3 class="info-window">' + place.name + '</h3>' +
      '<h5 class="info-window">' + place.formatted_address + '</h5>';
    // '<span (click)="more(place)">See More</span>';
    this.addInfoWindow(marker, content);
  }

  more(place) {
    this.navCtrl.push(Gym, place)
  }

  addInfoWindow(marker, content) {
    // let infoWindow = new google.maps.InfoWindow({
    //   content: content
    // });
    google.maps.event.addListener(marker, 'click', () => {
      // infoWindow.open(this.maps, marker);
      this.navCtrl.push(Gym, this.place);
      console.log(this.place);
    });
  }

  searchPlace() {
    this.saveDisabled = true;
    if (this.query.length > 0 && !this.searchDisabled) {
      let config = {
        types: ['establishment'],
        input: this.query
      }
      this.autocompleteService.getPlacePredictions(config, (predictions, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK && predictions) {
          this.places = [];
          predictions.forEach((prediction) => {
            this.places.push(prediction);
          });
        }
      });
    } else {
      this.places = [];
    }
  }

  save() {
    this.viewCtrl.dismiss(this.location);
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
