import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthProvider, ErrorHandlerProvider, IonicProvider } from '../../shared/index';
import { CalendarEvent, UserModel } from '../../models/index';
import { Search } from '../../components/index';
import moment from 'moment';

@Component({
  selector: 'notifications',
  templateUrl: 'notifications.html'
})
export class Notifications implements OnInit {

  mi: UserModel;
  notifications: CalendarEvent[];
  notificationsBackUp: CalendarEvent[];
  selected_date: string;
  isLoading: boolean;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private data$: AngularFireDatabase,
    private auth$: AuthProvider
  ) { }

  ngOnInit() {
    this.selected_date = this.navParams.data;
    this.mi = this.auth$.currentUser;
    this.getData();
  }

  getData() {
    this.isLoading = true;
    if (!this.selected_date) {
      this.selected_date = new Date().toString();
    }
    this.data$.list('/notifications/' + this.mi.uid,
    ref => ref.orderByChild('start').equalTo( moment(this.selected_date).startOf('day').toString())
    ).valueChanges()
      .subscribe((events: CalendarEvent[]) => {
        this.isLoading = false;
        this.notifications = this.notificationsBackUp = events;
      })
  }

  search() {
    const searchItems = ['title', 'content']
    let modal = this.modalCtrl.create(Search, { searchable: searchItems });
    modal.onDidDismiss((search) => {
      if (search) {
        this.notifications = this.notificationsBackUp
        this.notifications = this.notifications.filter(notification => {
          return search.title ? notification.title.toLowerCase().indexOf(search.title.toLowerCase()) > -1 : null
        })
      }
    })
    modal.present();
  }


}
