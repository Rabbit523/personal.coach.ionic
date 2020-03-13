import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from 'ionic-angular';
import { CalendarOptions, CalendarEvent, UserModel } from '../../../models/index';
import { NotificationForm } from '../../../components/index';
import moment from 'moment';
import { AngularFireDatabase } from 'angularfire2/database';
import { StorageProvider, AuthProvider, ErrorHandlerProvider, IonicProvider } from '../../../shared/index';


@Component({
  selector: 'mi-schedule',
  templateUrl: 'mi-schedule.html'
})
export class MiSchedule implements OnInit {
  mi: UserModel;
  cal_options: CalendarOptions;
  selected_day: { date: any; events: CalendarEvent[] }
  user: any;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private data$: AngularFireDatabase,
  ) { }

  ngOnInit() {
    this.cal_options = {
      display: 'gradient',
      showEvents: true,
      showEventDots: true,
      navType: 'left-right',
      isPage: true,
      showMenu: true
    }
    this.user = this.navParams.data;
  }


  getCurrentUser() {
    this.data$.object('/users/' + this.mi.uid).valueChanges()
    .subscribe((user) => {
      this.user = user;
    });
  }


  onEventsChange(day) {
    this.selected_day = day;
  }

  createNotification(day) {
    let params: { user: any, notification: CalendarEvent } = {
      user: this.user,
      notification: {
        extras: {},
        with: this.user.uid,
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
