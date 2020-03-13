import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StorageProvider, AuthProvider, ErrorHandlerProvider, IonicProvider } from '../../../shared/index';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { UserModel } from '../../../models/index';

@Component({
  selector: 'mi-profile',
  templateUrl: 'mi-profile.html'
})
export class MiProfile implements OnInit {

  cameraOptions: CameraOptions = {};
  profile_form: FormGroup;
  mi: UserModel;
  user: any;
  _user: AngularFireObject<any[]>;
  isLoading: boolean;
  age

  constructor(
    private fb: FormBuilder,
    private actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private data$: AngularFireDatabase,
    private auth$: AuthProvider,
    private storage$: StorageProvider,
    private ionic$: IonicProvider,
    private error$: ErrorHandlerProvider,
  ) { }

  ngOnInit() {
    this.mi = this.auth$.currentUser;
    var ageDifMs = Date.now() - new Date(this.mi.dob).getTime();
    var ageDate = new Date(ageDifMs);
    this.age = Math.abs(ageDate.getUTCFullYear() - 1970);
  }


}
