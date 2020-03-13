import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavParams, ViewController, NavController } from 'ionic-angular';
import { AuthProvider, IonicProvider, ErrorHandlerProvider } from '../../shared/index';
import { CalendarOptions, CalendarEvent, UserModel } from '../../models/index';
import { Notifications, NotificationForm } from '../index';
import * as moment from 'moment';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'calendar',
  templateUrl: 'calendar.html'
})
export class Calendar implements OnInit {

  @Input() options: CalendarOptions;
  @Input() user: any;
  @Output() events = new EventEmitter<any>();
  mi: UserModel;
  notifications: Array<CalendarEvent> = [];
  _notifications: Observable<CalendarEvent[]>;
  selected: any;
  selectedDate: Date;
  start: any;
  month: any;
  weeks: any[] = [];
  dayEvents: CalendarEvent[] = [];
  weekDayNames: string[];
  defaultOptions: CalendarOptions;
  isLoading: boolean;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private data$: AngularFireDatabase,
    private auth$: AuthProvider,
    private error$: ErrorHandlerProvider,
  ) {
    this.mi = this.auth$.currentUser;
   }

  ngOnInit() {
    this.defaultOptions = {
      showEvents: true,
      showEventDots: true,
      display: 'gradient',
      navType: 'left',
      isPage: true,
      showMenu: true
    }
    this.options = Object.assign(this.defaultOptions, this.options);
    this.weekDayNames = moment.weekdays();
    this.user = this.navParams.data;

    if (!this.selected) {
      this.selected = this._removeTime(this.selected || moment());
      this.month = this.selected.clone();

      this.start = this.selected.clone();
      this.start.date(1);
      this._removeTime(this.start.day(0));
    }
    this.findNotifications()

  }

  findNotifications() {
    this.data$.list('/notifications/' + this.mi.uid).valueChanges()
    .subscribe((events: CalendarEvent[]) => {
      this.notifications = events;
      this._buildMonth(this.start, this.month, this.notifications);

      let today = { day: {}, events: [] };
      this.weeks.map(week => {
        week.days.map(day => {
          if (day.date.isSame(moment(new Date()).startOf('day'), 'day')) {
            today = day;
          }
        })
      })
      if (today.events) {
        this.events.emit(today)
      } else {
        this.events.emit({ day: new Date(), events: [] })
      }
    },
      error => this.error$.handleError(error));
  }

  select(day) {
    this.selected = day.date;
    this.dayEvents = day.events;
    this.events.emit(day);
  };

  next() {
    let next = this.month.clone();
    next.date(1);
    this._removeTime(next.month(next.month() + 1)).day(0);
    this.month = this.month.month(this.month.month() + 1);
    this._buildMonth(next, this.month, this.notifications);
  };

  previous() {
    let previous = this.month.clone();
    this._removeTime(previous.month(previous.month() - 1).date(1));
    this.month.month(this.month.month() - 1);
    this._buildMonth(previous, this.month, this.notifications);
  };

  _removeTime(date) {
    return date.day(0).hour(0).minute(0).second(0).millisecond(0);
  }

  _buildMonth(start, month, calendar_events) {
    this.weeks = [];
    var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
    while (!done) {
      this.weeks.push({ days: this._buildWeek(date.clone(), month, calendar_events) });
      date.add(1, "w");
      done = count++ > 2 && monthIndex !== date.month();
      monthIndex = date.month();
    }
  }

  _buildWeek(date, month, calendar_events) {
    var days = [];
    for (var i = 0; i < 7; i++) {
      days.push({
        name: date.format("dd").substring(0, 1),
        number: date.date(),
        isCurrentMonth: date.month() === month.month(),
        isToday: date.isSame(moment(new Date()).startOf('day'), 'day'),
        date: date
      });

      date = date.clone();
      date.add(1, "d");
    }
    days.forEach(element => {
      calendar_events.forEach(eventItem => {
        let _eventItem = Object.assign({}, eventItem);
        let start = moment(eventItem.start).startOf('day');
        let end = moment(eventItem.start).endOf('day');
        if (moment(element.date).isBetween(start, end, null, '[]')) {
          !element.events ? element.events = [] : null
          element.events.push(_eventItem);
        }
      });
    });
    return days;
  }

  open(event) {
    let params: { user: any, notification: CalendarEvent } = {
      user: null,
      notification: event
    }
    this.navCtrl.push(NotificationForm, params);
  }

  openNotifications(selected) {
    this.navCtrl.push(Notifications, selected);
  }

  close() {
    if (this.options.isPage) {
      this.navCtrl.pop();
    } else {
      this.viewCtrl.dismiss()
    }
  }

}
