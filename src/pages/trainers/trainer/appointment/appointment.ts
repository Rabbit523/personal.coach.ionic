import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from 'ionic-angular';
import { CalendarOptions, CalendarEvent, TrainerModel } from '../../../../models/index';
import { NotificationForm } from '../../../../components/index';
import moment from 'moment';

@Component({
  selector: 'appointment',
  templateUrl: 'appointment.html'
})
export class Appointment implements OnInit {

  cal_options: CalendarOptions;
  trainer: TrainerModel;
  selected_day: { date: any; events: CalendarEvent[] }

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.cal_options = {
      display: 'light',
      showEvents: false,
      showEventDots: true,
      navType: 'left-right',
      isPage: false,
      showMenu: false
    }
    this.trainer = this.navParams.data;
  }

  onEventsChange(day) {
    this.selected_day = day;
  }

  makeAppt(day) {
    let params: { user: any, notification: CalendarEvent } = {
      user: this.trainer,
      notification: {
        extras: {},
        with: this.trainer.uid,
        start: moment(day).toISOString(),
        end: moment(day).toISOString(),
        recurrence: 'none',
        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        start_time: moment().startOf('date').toISOString(),
        end_time: moment().endOf('date').toISOString(),
      }
    }
    let modal = this.modalCtrl.create(NotificationForm, params)
    modal.onDidDismiss(() => { })
    modal.present();
  }
}
