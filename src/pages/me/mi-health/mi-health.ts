import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StorageProvider, AuthProvider, ErrorHandlerProvider, IonicProvider } from '../../../shared/index';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { UserModel } from '../../../models/index';

@Component({
  selector: 'mi-health',
  templateUrl: 'mi-health.html'
})
export class MiHealth implements OnInit {

  profile_form: FormGroup;
  mi: UserModel;
  user: any;
  _user: AngularFireObject<any[]>;
  isLoading: boolean;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private data$: AngularFireDatabase,
    private auth$: AuthProvider,
    private storage$: StorageProvider,
    private ionic$: IonicProvider,
    private error$: ErrorHandlerProvider,
  ) { }

  ngOnInit() {
    this.mi = this.auth$.currentUser;
    this._user = this.data$.object('/users/' + this.mi.uid);

    this.profile_form = this.fb.group({
      weight: [''],
      height: [''],
      bmi: [''],
      bfp: ['']
    });

    this.isLoading = true;
    this._user.valueChanges().subscribe((user) => {
      this.user = user;
      if (this.user) this.profile_form.patchValue(this.user);
      this.isLoading = false;
    });
  }


  save({ value, valid }: { value: any, valid: boolean }) {
    if (valid) {
      this._user.update(value).then(
        (user) => {
          this.ionic$.presentToast('User Saved');
          this.navCtrl.pop();
        },
        (error) => this.error$.handleError(error));
    }
  }
}
