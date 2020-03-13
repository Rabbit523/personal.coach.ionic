import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthProvider, ErrorHandlerProvider, IonicProvider } from '../../../shared/index';
import { MiProfileForm, MiHealth } from '../../index';
import { UserModel } from '../../../models/index';

@Component({
  selector: 'mi-goals',
  templateUrl: 'mi-goals.html'
})
export class MiGoals implements OnInit {

  mi: UserModel;

  constructor(
    private navCtrl: NavController,
    private data$: AngularFireDatabase,
    private auth$: AuthProvider,
    private ionic$: IonicProvider,
    private error$: ErrorHandlerProvider
  ) { }

  ngOnInit() {

    this.mi = this.auth$.currentUser;
    this.mi.lbm = +this.mi.weight - (+this.mi.weight * +this.mi.bfp / 100); //calculate lean body mass
  }

  profile() {
    this.navCtrl.push(MiProfileForm);
  }

  health() {
    this.navCtrl.push(MiHealth);
  }
}
