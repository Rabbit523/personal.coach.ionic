import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StorageProvider, AuthProvider, ErrorHandlerProvider, IonicProvider } from '../../../shared/index';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { UserModel } from '../../../models/index';

@Component({
  selector: 'mi-profile-form',
  templateUrl: 'mi-profile-form.html'
})
export class MiProfileForm implements OnInit {


  profile_form: FormGroup;
  mi: UserModel;
  user: any;
  _user: AngularFireObject<any[]>;
  isLoading: boolean;
  genders: Array<{ value: string; text: string }> = [
    { text: 'Male', value: 'M' },
    { text: 'Female', value: 'F' },
    { text: 'Unspecified', value: 'U' }
  ]
  cameraOptions: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType: this.camera.PictureSourceType.CAMERA
  };

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
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
    this._user = this.data$.object('/users/' + this.mi.uid);

    this.profile_form = this.fb.group({
      fullname: [''],
      picture: [''],
      address: [''],
      city: [''],
      country: [''],
      gender: [],
      dob: [''],
      about: [''],
      uid: []
    });

    this.isLoading = true;
    this._user.valueChanges().subscribe((user) => {
      this.user = user;
      if (this.user) this.profile_form.patchValue(this.user);
      this.isLoading = false;
    });
  }

  addImage(ev) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Save Image from',
      buttons: [
        {
          text: 'Camera',
          handler: () => {
            this.cameraOptions.sourceType = this.camera.PictureSourceType.CAMERA
            this.getPicture(this.cameraOptions);
          }
        },
        {
          text: 'Photo Library',
          handler: () => {
            this.cameraOptions.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY
            this.getPicture(this.cameraOptions);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

  getPicture(cameraOptions: CameraOptions) {
    this.camera.getPicture(cameraOptions).then((imageData) => {
      this.user.picture =  'data:image/jpeg;base64,' + imageData;
      this.profile_form.patchValue({ picture: 'data:image/jpeg;base64,' + imageData })
    }, (error) => {
      this.error$.handleError(error);
    });
  }

  save({ value, valid }: { value: any, valid: boolean }) {
    if (valid) {
      value.uid = this.mi.uid
      if (value.picture) {
        this.storage$
          .uploadFile(this.mi.uid.replace(' ', '_'), value.picture)
          .then((file) => {
            value.picture = file;
            this._user.update(value).then(
              (user) => {
                this.ionic$.presentToast('User Saved');
                this.navCtrl.pop();
              },
              (error) => this.error$.handleError(error));
          });
      } else {
        this._user.update(value).then(
          (user) => {
            this.ionic$.presentToast('User Saved');
            this.navCtrl.pop();
          },
          (error) => this.error$.handleError(error));
      }
    }
  }
}
