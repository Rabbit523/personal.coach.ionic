import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, FabContainer } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AuthProvider, ErrorHandlerProvider, IonicProvider } from '../../shared/index';
import { GymModel, UserModel } from '../../models/index';
import { Gym } from '../index';
import { Search, Map } from '../../components/index';
import { CallNumber } from '@ionic-native/call-number';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-gyms',
  templateUrl: 'gyms.html',
})
export class Gyms {

  mi: UserModel;
  gyms: GymModel[];
  gymsBackup: GymModel[];
  _gyms: AngularFireList<GymModel[]>;
  isLoading: boolean;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private callNumber: CallNumber,
    private geolocation: Geolocation,
    private iab: InAppBrowser,
    private data$: AngularFireDatabase,
    private auth$: AuthProvider,
    private ionic$: IonicProvider,
    private error$: ErrorHandlerProvider
  ) { }

 ionViewDidLoad() {
    /*
    Get Current Location
    Get trainers
    user your current Location and trainers Location Coordinates to find distance away
     */
    this.mi = this.auth$.currentUser;
    this.geolocation.getCurrentPosition().then((resp) => {
      this._gyms = this.data$.list('/gyms');
      this.isLoading = true;
      this._gyms.valueChanges().subscribe((gyms: any) => {
        this.gyms = this.gymsBackup = gyms;
        this.gyms.forEach(gym => {
          let my_cords = [resp.coords.latitude, resp.coords.longitude]
          let gym_cords = [gym.geometry.location.lat, gym.geometry.location.lng];
          gym.distance_away = this.ionic$.calculateDistance(my_cords, gym_cords);
      });
        this.isLoading = false;
      });
    }).catch((error) => this.error$.handleError(error));
  }

  search() {
    let modal = this.modalCtrl.create(Search, { searchable: ['name', 'vicinity','rating'] });
    modal.onDidDismiss((search) => {
      this.gyms = this.gymsBackup;
      if (search) {
        this.gyms = this.gyms.filter(gym => {
          return search.name ? gym.name.toLowerCase().indexOf(search.fullname.toLowerCase()) > -1 : null
            || search.vicinity ? gym.vicinity.toLowerCase().indexOf(search.city.toLowerCase()) > -1 : null
            || search.rating ? gym.rating === +search.rating : null;
        })
      }
    })
    modal.present();
  }

  open(gym) {
    this.navCtrl.push(Gym, gym)
  }

  call(gym: GymModel, fab: FabContainer) {
    fab.close();
    this.callNumber.callNumber(gym.detail.formatted_phone_number, true);
  }

  map(gym:GymModel, fab: FabContainer) {
    fab.close();
   this.navCtrl.push(Map, {coords: [gym.geometry.location.lat, gym.geometry.location.lng], location: gym});
  }

   webpage(gym:GymModel, fab: FabContainer){
     fab.close();
    this.iab.create(gym.detail.website);
  }

}
