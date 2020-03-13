import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GymModel, TrainerModel } from '../../../models/index';
import { Map } from '../../../components/index';
import { CallNumber } from '@ionic-native/call-number';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AuthProvider, ErrorHandlerProvider, IonicProvider } from '../../../shared/index';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'gym',
  templateUrl: 'gym.html'
})
export class Gym implements OnInit {

  gym: GymModel;
  members: TrainerModel[];
  _trainers: AngularFireList<TrainerModel[]>;
  contacts: any[] = [
    {
      icon: 'call-outline',
      click: (e) => {this.call(this.gym)}
    },
    {
      icon: 'globe-outline',
      click: (e) => {this.webpage()}
    },
    {
      icon: 'logo-twitter',
      click: (e) => {}
    },
    {
      icon: 'logo-google',
      click: (e) => {}
    }
  ]

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private callNumber: CallNumber,
    private iab: InAppBrowser,
    private data$: AngularFireDatabase
  ) { }


  ngOnInit() {
    this.gym = this.navParams.data;
    this.getMembers();
  }

  getMembers() {
    this.data$.list('/trainers').valueChanges().subscribe((trainers: TrainerModel[]) => {
      this.members = trainers;
    });
  }

  webpage(){
    this.iab.create(this.gym.detail.website);
  }

  call(gym:GymModel) {
    this.callNumber.callNumber(gym.detail.formatted_phone_number, true);
  }

  map(gym:GymModel) {
    this.navCtrl.push(Map, {coords: [gym.geometry.location.lat, gym.geometry.location.lng], location: gym});
  }


}
