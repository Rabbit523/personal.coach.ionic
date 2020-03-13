import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, FabContainer } from 'ionic-angular';
import { Trainer, Appointment } from '../index';
import { Search, Chat, } from '../../components/index';
import { TrainerModel, UserModel } from '../../models/index';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AuthProvider, ErrorHandlerProvider, IonicProvider } from '../../shared/index';
import { Geolocation } from '@ionic-native/geolocation';
import { CallNumber } from '@ionic-native/call-number';

@Component({
  selector: 'page-trainers',
  templateUrl: 'trainers.html',
})
export class Trainers {

  mi: UserModel;
  trainers: TrainerModel[];
  trainersBackup: TrainerModel[];
  _trainers: AngularFireList<TrainerModel[]>;
  isLoading: boolean;


  constructor(
    private callNumber: CallNumber,
    private geolocation: Geolocation,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
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
    this.isLoading = true;
    this.mi = this.auth$.currentUser;
    this.geolocation.getCurrentPosition().then((resp) => {
      this._trainers = this.data$.list('/trainers');
      this._trainers.valueChanges().subscribe((trainers: any) => {
        this.trainers = this.trainersBackup = trainers;
        this.trainers.forEach(trainer => {
          let my_cords = [resp.coords.latitude, resp.coords.longitude]
          let trainer_cords = [trainer.location.lat, trainer.location.lng];
          trainer.distance_away = this.ionic$.calculateDistance(my_cords, trainer_cords);
        });
        this.isLoading = false;
      });
    }).catch((error) => this.error$.handleError(error));
  }

/*
  send an object with key 'searchable' of an array of string to parameters of modal control used to open search page.
  the array values are used to create form fields in the search modal. these field's values are then filtered to
  get resulting trainers based on search criteria
*/
  search() {
    let modal = this.modalCtrl.create(Search, { searchable: ['fullname', 'city', 'country', 'gym', 'rating'] });
    modal.onDidDismiss((search) => {
      this.trainers = this.trainersBackup;
      if (search) {
        this.trainers = this.trainers.filter(trainer => {
          return search.fullname ? trainer.fullname.toLowerCase().indexOf(search.fullname.toLowerCase()) > -1 : null
            || search.city ? trainer.city.toLowerCase().indexOf(search.city.toLowerCase()) > -1 : null
              || search.country ? trainer.country.toLowerCase().indexOf(search.country.toLowerCase()) > -1 : null
                || search.gym ? trainer.gym.toLowerCase().indexOf(search.gym.toLowerCase()) > -1 : null
                  || search.rating ? trainer.rating === +search.rating : null;
        })
      }
    })
    modal.present();
  }

  open(trainer) {
    this.navCtrl.push(Trainer, trainer)
  }

  call(trainer, fab: FabContainer) {
    fab.close();
    this.callNumber.callNumber(trainer.phone, true);
  }

  chat(trainer, fab: FabContainer) {
    fab.close();
    this.navCtrl.push(Chat, trainer);
  }

  calendar(trainer, fab: FabContainer) {
    fab.close();
    this.navCtrl.push(Appointment, trainer);
  }

}
