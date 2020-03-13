import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Appointment } from '../../../pages/index';
import { TrainerModel } from '../../../models/index';
import { Chat } from '../../../components/index';
import { CallNumber } from '@ionic-native/call-number';

@Component({
  selector: 'trainer',
  templateUrl: 'trainer.html'
})
export class Trainer implements OnInit {

  trainer: TrainerModel;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private callNumber: CallNumber
  ) { }

  ngOnInit() {
    this.trainer = this.navParams.data;
  }

    call(trainer) {
    this.callNumber.callNumber(trainer.phone, true);
  }

  chat(trainer) {
    this.navCtrl.push(Chat, trainer);
  }


  bookAppt(trainer) {
    this.navCtrl.push(Appointment, trainer);
  }

}
