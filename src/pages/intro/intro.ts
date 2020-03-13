import { Component, OnInit } from '@angular/core';
import { NavController, Events } from 'ionic-angular'
import { AuthProvider, ErrorHandlerProvider, IonicProvider } from '../../shared/index';
import { Gyms, Trainers, Me, Blogs } from '../index';
import { Notifications } from '../../components/index';
import { UserModel } from '../../models/index';

@Component({
  selector: 'intro',
  templateUrl: 'intro.html'
})
export class Intro implements OnInit {

  mi: UserModel;
  rows: number[];
  menus: Array<{ icon: string; head: string; sub: string; component?: any }>;

  constructor(
    private navCtrl: NavController,
    private auth$: AuthProvider,
    private events: Events
  ) { }

  ngOnInit() {
    this.auth$.getUser().subscribe((user: any) => {
      this.mi = user;
      this.events.publish('loggedIn', this.mi);
    });
    this.menus = [
      {
        icon: './assets/walkthrough/trainer.png',
        head: 'Trainer',
        sub: 'Find a trainer',
        component: Trainers
      }, {
        icon: './assets/walkthrough/gym.png',
        head: 'Gym',
        sub: 'Find a gym',
        component: Gyms
      }, {
        icon: './assets/walkthrough/news.png',
        head: 'Blogs',
        sub: 'Information Center',
        component: Blogs
      }, {
        icon: './assets/walkthrough/you.png',
        head: 'You',
        sub: 'All about you!',
        component: Me
      },

    ]
    this.rows = Array.from(Array(Math.ceil(this.menus.length / 2)).keys());
  }

  open(menu: { icon: string; head: string; sub: string; component: any }) {
    this.navCtrl.setRoot(menu.component)
  }

  openMe() {
    this.navCtrl.setRoot(Me)
  }

  openNotifications() {
    this.navCtrl.push(Notifications);
  }

}
