import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthProvider, ErrorHandlerProvider, IonicProvider } from '../../shared/index';
import { CalendarEvent, UserModel } from './../../models/index';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import moment from 'moment';

@Component({
  selector: 'notification-form',
  templateUrl: 'notification-form.html'
})
export class NotificationForm implements OnInit {

  notification_form: FormGroup;
  mi: UserModel;
  with: any;
  key: any;
  with_user: any;
  notification: CalendarEvent;
  _notification: AngularFireList<any[]>;
  recurrences: Array<{ value: string; text: string; }> = [
    {
      value: 'none',
      text: 'None'
    }, {
      value: 'daily',
      text: 'Daily'
    }, {
      value: 'weekly',
      text: 'Weekly'
    }, {
      value: 'fortnightly',
      text: 'Fortnightly'
    }, {
      value: 'monthly',
      text: 'Monthly'
    }, {
      value: 'yearly',
      text: 'Yearly'
    },
  ]

  constructor(
    private fb: FormBuilder,
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private data$: AngularFireDatabase,
    private auth$: AuthProvider,
    private ionic$: IonicProvider,
    private error$: ErrorHandlerProvider,
  ) { }

  ngOnInit() {
    this.mi = this.auth$.currentUser;
    this.notification = this.navParams.get('notification');
    this.with_user = this.navParams.get('user');
    this.key = this.navParams.get('key');

    this.notification_form = this.fb.group({
      title:[this.notification ? this.notification.title : ''],
      start: [this.notification ? new Date(this.notification.start).toISOString() : new Date()],
      start_time: [this.notification ? this.notification.start_time : ''],
      end: [this.notification ? new Date(this.notification.end).toISOString() : new Date()],
      end_time: [this.notification ? this.notification.end_time : ''],
      recurrence: [this.notification ? this.notification.recurrence : 'none'],
      color: [this.notification ? this.notification.color : '#' + Math.floor(Math.random() * 16777215).toString(16)],
      extras: [this.notification ? this.notification.extras : ''],
      created_by: [this.mi.uid],
      with: [this.notification.with],
      user_detail: this.fb.group({
        fullname: this.mi.fullname,
        picture: this.mi.picture
      })
    });
  }

  save({ value, valid }: { value: any, valid: boolean }) {
    if (valid) {
      value.start = moment(value.start).startOf('day').toString();
      if (!this.key) {
        this.data$.list('/notifications/'+ this.mi.uid).push(value).then(
          appt => this.ionic$.presentToast('Notification Created'),
          error => this.error$.handleError(error));
      } else {
        this.data$.list('/notifications/'+ this.mi.uid).update(this.key, value)
          .then(
          appt => this.ionic$.presentToast('Notification Updated'),
          error => this.error$.handleError(error));;
      }
      this.viewCtrl.dismiss();
    }
  }
}

